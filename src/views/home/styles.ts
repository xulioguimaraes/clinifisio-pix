import { Heading, styled, Text } from "@ignite-ui/react";

export const Container = styled("div", {
  maxWidth: "calc(100vw - (100vw - 1160px) / 2)",
  display: "flex",
  alignItems: "center",
  height: "100vh",
  gap: "$20",
  marginLeft: "auto",
});

export const Hero = styled("div", {
  maxWidth: 480,
  padding: "0 $10",

  [`> ${Heading}`]: {
    "@media(max-width: 600px)": {
      fontSize: "$6xl",
    },
  },
  [`> ${Text}`]: {
    marginTop: "$2",
    color: "$gray200",
  },
});

export const Preview = styled("div", {
  paddingRight: "$8",
  overflow: "hidden",

  "@media(max-width: 600px)": {
    display: "none",
  },
});
