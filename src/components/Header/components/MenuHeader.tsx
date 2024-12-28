import { Mail } from "@mui/icons-material";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { dataMenu } from "./datamenu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
const ItemMenu = ({
  name,
  children,
}: {
  name: string;
  link: string;
  icon: JSX.Element;
  children: {
    name: string;
    link: string;
  }[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListItem key={name} disablePadding>
        <ListItemButton
          onClick={() => {
            if (children.length > 0) {
              setOpen(!open);
            }
          }}
        >
          <ListItemIcon>
            <Mail />
          </ListItemIcon>
          <ListItemText primary={name} />
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </ListItemButton>
      </ListItem>
      {open &&
        children.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                if (children.length > 0) {
                  setOpen(!open);
                }
              }}
            >
              <ListItemIcon className="pl-4">
                <RadioButtonUncheckedIcon className="text-xs" />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      <Divider />
    </>
  );
};

export const MenuHeader = ({}) => {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <div className="mt-20"></div>
      <Divider />
      <List>
        {dataMenu.map((item, index) => (
          <ItemMenu key={item.name} {...item} />
        ))}
      </List>
    </Box>
  );
};
