import type { TreeNode } from "primereact/treenode";

export const NodeService = {
  getTreeNodes(): Promise<TreeNode[]> {
    return Promise.resolve([
      {
        key: "0",
        label: "Pelita Clinic",
        data: "Clinic",
        children: [
          { key: "0-0", label: "Home", data: "Section" },
          { key: "0-1", label: "Services", data: "Section" },
          { key: "0-2", label: "Panels", data: "Section" },
          { key: "0-3", label: "Profile", data: "Section" },
          { key: "0-4", label: "Reviews", data: "Section" },
          { key: "0-5", label: "Contact", data: "Section" },
        ],
      },
    ]);
  },
};

