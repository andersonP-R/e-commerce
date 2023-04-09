import { FC } from "react";
import { Fade } from "react-slideshow-image";
import { Box } from "@mui/material";
import { loginSlideImages } from "@/utils";
import styles from "./LoginSlideshow.module.css";
import "react-slideshow-image/dist/styles.css";

export const LoginSlideshow: FC = () => {
  return (
    <Box
      sx={{
        width: "calc(100vw - 350px)",
        display: { xs: "none", sm: "block" },
      }}
    >
      <Fade easing="ease" duration={2000} arrows={false}>
        {loginSlideImages.map((image) => {
          return (
            <div className={styles["each-slide"]} key={image.id}>
              <div
                style={{
                  backgroundImage: `url(${image.picture})`,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          );
        })}
      </Fade>
    </Box>
  );
};
