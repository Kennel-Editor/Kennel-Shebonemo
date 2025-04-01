import { useState, useEffect } from "react";
import sanityClient from "../sanityClient";

const useSiteSettings = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const query = `*[_type == "siteSettings"][0]`;
      const data = await sanityClient.fetch(query);
      setSettings(data);
    };

    fetchSettings();
  }, []);

  return settings;
};

export default useSiteSettings;
