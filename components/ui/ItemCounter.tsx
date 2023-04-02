import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { IconContext } from "react-icons";

interface Props {
  currentValue: number;
  maxValue: number;

  // Methods
  updatedQuantity: (newValue: number) => void;
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  updatedQuantity,
  maxValue,
}) => {
  const addOrRemove = (value: number) => {
    if (value === -1) {
      if (currentValue === 1) return;

      return updatedQuantity(currentValue - 1);
    }

    if (currentValue >= maxValue) return;

    updatedQuantity(currentValue + 1);
  };

  return (
    <Box display="flex" alignItems="center">
      <IconContext.Provider
        value={{ style: { fontSize: "1.4rem", color: "#000" } }}
      >
        <IconButton onClick={() => addOrRemove(-1)}>
          <MdRemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: "center" }}>
          {" "}
          {currentValue}{" "}
        </Typography>
        <IconButton onClick={() => addOrRemove(+1)}>
          <MdAddCircleOutline />
        </IconButton>
      </IconContext.Provider>
    </Box>
  );
};
