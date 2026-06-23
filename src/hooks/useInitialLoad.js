import { useEffect, useRef } from "react";

const useInitialLoad = (loader) => {
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loader();
    }
  }, [loader]);
};

export default useInitialLoad;
