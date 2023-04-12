import { FC, PropsWithChildren, useEffect, useReducer } from "react";
import Cookie from "js-cookie";
import axios from "axios";

import { CartContext, cartReducer } from "./";
import { tesloApi } from "../../axiosApi";
import { ICartProduct, IOrder, ShippingAddress } from "@/interfaces";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  // Efecto
  useEffect(() => {
    try {
      const cookieProducts = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (Cookie.get("firstName")) {
      const shippingAddress = {
        firstName: Cookie.get("firstName") || "",
        lastName: Cookie.get("lastName") || "",
        address: Cookie.get("address") || "",
        address2: Cookie.get("address2") || "",
        zip: Cookie.get("zip") || "",
        city: Cookie.get("city") || "",
        country: Cookie.get("country") || "",
        phone: Cookie.get("phone") || "",
      };

      dispatch({
        type: "[Cart] - LoadAddress from Cookies",
        payload: shippingAddress,
      });
    }
  }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart), {
      sameSite: "none",
      secure: true,
    });
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };

    dispatch({ type: "[Cart] - Update order summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    //
    // .some() nos devuelve un booleano si la condicion se cumple
    // comprobamos si el producto (p) que tenemos en el carrito (state.cart) es igual al que nos llega por
    // parametro (product)
    const productInCart = state.cart.some((p) => p._id === product._id);

    // si no, lo agregamos directamente
    if (!productInCart) {
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    }

    // comprobamos la talla para ver si ya tenemos un producto con la misma talla
    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );

    // si no, lo agregamos (el producto) al carrito
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    }

    // Acumulamos los productos que sean de la misma talla en un solo producto solo que con la cantidad
    // (quantity) aumentada. Esto para no agregar el mismo producto o que se remplaze directamente en el
    // carrito
    const updatedProducts = state.cart.map((p) => {
      // comprobamos que no sean el mismo producto ni la misma talla, de lo contrario devolvemos el mismo producto
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      // Actualizar la cantidad
      p.quantity += product.quantity;
      return p;
    });

    // finalmente devolvemos el producto con la cantidad acumulada si había mas de uno
    dispatch({
      type: "[Cart] - Update products in cart",
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Change cart quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Remove product in cart", payload: product });
  };

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set("firstName", address.firstName, {
      sameSite: "none",
      secure: true,
    });
    Cookie.set("lastName", address.lastName, {
      sameSite: "none",
      secure: true,
    });
    Cookie.set("address", address.address, { sameSite: "none", secure: true });
    Cookie.set("address2", address.address2 || "", {
      sameSite: "none",
      secure: true,
    });
    Cookie.set("zip", address.zip, { sameSite: "none", secure: true });
    Cookie.set("city", address.city, { sameSite: "none", secure: true });
    Cookie.set("country", address.country, { sameSite: "none", secure: true });
    Cookie.set("phone", address.phone, { sameSite: "none", secure: true });

    dispatch({ type: "[Cart] - Update Address", payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("No hay dirección de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>("/orders", body);

      dispatch({ type: "[Cart] - Order complete" });

      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "Error no controlado, hable con el administrador",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        // Methods
        addProductToCart,
        removeCartProduct,
        updateCartQuantity,
        updateAddress,

        // Orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
