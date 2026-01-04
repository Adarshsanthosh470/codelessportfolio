import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { EditorState, PortfolioData, CanvasElement } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/templates";

interface EditorContextType {
  state: EditorState;
  setMode: (mode: "template" | "canvas") => void;
  selectTemplate: (templateId: string) => void;
  updatePortfolioData: (data: Partial<PortfolioData>) => void;
  updateCustomColors: (colors: Partial<EditorState["customColors"]>) => void;
  updateCustomFont: (font: string) => void;
  addCanvasElement: (element: Omit<CanvasElement, "id">) => void;
  updateCanvasElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeCanvasElement: (id: string) => void;
  resetEditor: () => void;
}

const STORAGE_KEY = "codeless-portfolio-draft";

/**
 * IMPORTANT:
 * We MUST deep-clone defaultPortfolioData.
 * Never store imported objects directly in React state.
 */
const initialState: EditorState = {
  mode: "template",
  selectedTemplate: null,
  portfolioData: structuredClone(defaultPortfolioData),
  canvasElements: [],
  customColors: {
    primary: "#f97316",
    secondary: "#1f2937",
    background: "#ffffff",
    text: "#111827",
  },
  customFont: "Inter",
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  initialData?: Partial<EditorState>;
}

export const EditorProvider = ({ children, initialData }: EditorProviderProps) => {
  // 🔹 Load state from localStorage ONCE (safe + cloned) or use initialData
  const [state, setState] = useState<EditorState>(() => {
    if (initialData) {
      return {
        ...initialState,
        ...initialData,
        portfolioData: structuredClone(initialData.portfolioData || defaultPortfolioData),
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          portfolioData: structuredClone(parsed.portfolioData),
        };
      }
      return {
        ...initialState,
        portfolioData: structuredClone(defaultPortfolioData),
      };
    } catch {
      return {
        ...initialState,
        portfolioData: structuredClone(defaultPortfolioData),
      };
    }
  });

  // 🔹 Persist state to localStorage on every change (only if not using initialData)
  useEffect(() => {
    if (initialData) return; // Don't persist when viewing published portfolios

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage write errors
    }
  }, [state, initialData]);

  const setMode = (mode: "template" | "canvas") => {
    setState((prev) => ({ ...prev, mode }));
  };

  const selectTemplate = (templateId: string) => {
    setState((prev) => ({ ...prev, selectedTemplate: templateId }));
  };

  const updatePortfolioData = (data: Partial<PortfolioData>) => {
    setState((prev) => ({
      ...prev,
      portfolioData: { ...prev.portfolioData, ...data },
    }));
  };

  const updateCustomColors = (
    colors: Partial<EditorState["customColors"]>
  ) => {
    setState((prev) => ({
      ...prev,
      customColors: { ...prev.customColors, ...colors },
    }));
  };

  const updateCustomFont = (font: string) => {
    setState((prev) => ({ ...prev, customFont: font }));
  };

  const addCanvasElement = (element: Omit<CanvasElement, "id">) => {
    const newElement: CanvasElement = {
      ...element,
      id: `element-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      canvasElements: [...prev.canvasElements, newElement],
    }));
  };

  const updateCanvasElement = (
    id: string,
    updates: Partial<CanvasElement>
  ) => {
    setState((prev) => ({
      ...prev,
      canvasElements: prev.canvasElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  };

  const removeCanvasElement = (id: string) => {
    setState((prev) => ({
      ...prev,
      canvasElements: prev.canvasElements.filter((el) => el.id !== id),
    }));
  };

  const resetEditor = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...initialState,
      portfolioData: structuredClone(defaultPortfolioData),
    });
  };

  return (
    <EditorContext.Provider
      value={{
        state,
        setMode,
        selectTemplate,
        updatePortfolioData,
        updateCustomColors,
        updateCustomFont,
        addCanvasElement,
        updateCanvasElement,
        removeCanvasElement,
        resetEditor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
