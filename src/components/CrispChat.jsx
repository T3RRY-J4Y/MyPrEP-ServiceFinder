import { useEffect } from "react";

const CRISP_WEBSITE_ID = "81ed0231-0ad9-45f3-a70f-e4da9e18d7a7";

export default function CrispChat() {
  useEffect(() => {
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    if (!document.getElementById("crisp-script")) {
      const s = document.createElement("script");
      s.id = "crisp-script";
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      document.head.appendChild(s);
    } else {
      window.$crisp.push(["do", "chat:show"]);
    }

    return () => {
      window.$crisp.push(["do", "chat:hide"]);
    };
  }, []);

  return null;
}
