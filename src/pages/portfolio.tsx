import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPortfolioByUsername } from "@/services/publicPortfolioService";
import PortfolioPreview from "@/components/editor/PortfolioPreview";
import { EditorProvider } from "@/contexts/EditorContext";

export default function Portfolio() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    getPortfolioByUsername(username)
      .then(setData)
      .catch(() => setError("Portfolio not found"));
  }, [username]);

  if (error) {
    return <div className="p-10 text-center">404 — Portfolio not found</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  const cleanData = JSON.parse(JSON.stringify(data));

  return (
    <EditorProvider initialData={{ portfolioData: cleanData }}>
      <PortfolioPreview readOnly />
    </EditorProvider>
  );
}
