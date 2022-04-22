import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FingerprintJsProAgent } from "./FingerprintJsProAgent";
import { FingerprintJsProContext } from "./FingerprintJsProContext";
import { Region } from "./types";

interface FingerprintJsProProviderOptions {
  apiKey: string;
  region?: Region;
  endpointUrl?: string;
}

export function FingerprintJsProProvider({
  children,
  apiKey,
  region,
  endpointUrl,
}: PropsWithChildren<FingerprintJsProProviderOptions>) {
  console.log('FingerprintJsProProvider', apiKey)
  const [client, setClient] = useState<FingerprintJsProAgent>(
    () => new FingerprintJsProAgent(apiKey, region, endpointUrl)
  );
  const [visitorId, updateVisitorId] = useState("");

  const getVisitorData = useCallback(async () => {
    const result = await client.getVisitorId();
    updateVisitorId(result);
    return result;
  }, [client]);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender) {
      firstRender.current = false;
    } else {
      console.log('useEffect', apiKey)
      setClient(new FingerprintJsProAgent(apiKey, region, endpointUrl));
    }
  }, [apiKey, region, endpointUrl]);

  const contextValue = useMemo(() => {
    return {
      visitorId,
      getVisitorData,
    };
  }, []);

  return (
    <FingerprintJsProContext.Provider value={contextValue}>
      {children}
    </FingerprintJsProContext.Provider>
  );
}
