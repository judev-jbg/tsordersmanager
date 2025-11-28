import useTheme from "../hooks/useTheme";
import { MdSunny } from "react-icons/md";
import { IoIosMoon } from "react-icons/io";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <MdSunny /> : <IoIosMoon />}
    </button>
  );
};

export default ThemeToggle;
