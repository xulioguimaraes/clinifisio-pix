import { Box, Heading, styled, Text } from "@ignite-ui/react";

export const IntervalBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
});

export const IntervalContainer = styled("div", {
  border: "1px solid $gray600",
  borderRadius: "$md",
  marginBottom: "$4",
});
export const Container = styled("main", {
  maxWidth: 572,
  margin: "$20 auto $4",
  padding: "0 $4",
});

export const Header = styled("div", {
  paddingLeft: "$6",
  paddingRight: "$6",

  [` > ${Heading}`]: {
    lineHeight: "$base",
  },

  [` > ${Text}`]: {
    color: "$gray200",
    marginBottom: "$6",
  },
});

export const IntervalItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$3 $4",

  "& + &": {
    borderTop: "1px solid $gray600",
  },
});

export const IntervalDay = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
});

export const IntervalInput = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",

  "input::-webkit-calendar-picker-indicator": {
    filter: "invert(100%) brightness(30%)",
  },
});

export const FormError = styled(Text, {
  color: "#f75a88",
  marginBottom: "$2",
});
