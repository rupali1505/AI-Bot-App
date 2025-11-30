import { Outlet } from "react-router-dom";
import { ThemeContext } from "./Theme/ThemeContext";
import { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar/Sidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { getThemePallete } from "./Theme/ThemePalette";
import { Grid, useMediaQuery, Box } from "@mui/material";

function App() {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");
  const [chat, setChat] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:800px)");

  const theme = React.useMemo(() => createTheme(getThemePallete(mode)), [mode]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode: mode, setMode: setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Grid
          container
          direction="row"
          wrap="nowrap"
          sx={{
            height: "100vh",
            background:
              "linear-gradient(rgba(215, 199, 244, 0.2), rgba(151, 133, 186, 0.2))",
          }}
        >
         
          <Grid
            item
            xs={12}
            md={2.5}
            flexShrink={0}
            sx={{
              width: isMobile ? "70%" : "auto", 
              position: isMobile ? "fixed" : "relative",
              left: 0,
              top: 0,
              height: "100vh",
              transform: isMobile
                ? menuOpen
                  ? "translateX(0)"
                  : "translateX(-100%)"
                : "none",
              transition: "transform 300ms ease",
              zIndex: 2000, // 🔥 Always above navbar
              boxShadow: isMobile && menuOpen ? 10 : 0,
              bgcolor: "primary.light",
            }}
          >
            <Sidebar setChat={setChat} closeMenu={() => setMenuOpen(false)} />
          </Grid>

          
          {isMobile && menuOpen && (
            <Box
              onClick={() => setMenuOpen(false)}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 1000, 
              }}
            />
          )}

          {/* Main Content */}
          <Grid item xs={12} md={9.5} flexGrow={1}>
            <Outlet
              context={{
                chat: chat,
                setChat: setChat,
                handleMobileMenu: setMenuOpen,
                isMobile,
              }}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
