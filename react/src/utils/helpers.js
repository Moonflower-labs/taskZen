import { FaFilePdf, FaFileWord, FaFileExcel, FaFile } from "react-icons/fa";
import { createElement } from "react";
export function calculateCompletionPercentage(tasks) {
  if (tasks.length === 0) {
    return 0; // If there are no tasks, completion percentage is 0
  } else {
    const completedTasksCount = tasks.filter(
      (task) => task.status === "Complete"
    ).length;
    const totalTasksCount = tasks.length;
    const completionPercentage = (completedTasksCount / totalTasksCount) * 100;
    return completionPercentage.toFixed(1);
  }
}

export const getFileExtension = (fileUrl) => {
  return fileUrl.split(".").pop().toLowerCase();
};

export const getFileIcon = (fileExtension) => {
  switch (fileExtension) {
    case "pdf":
      return createElement(FaFilePdf);
    case "doc":
    case "docx":
      return createElement(FaFileWord);
    case "xls":
    case "xlsx":
      return createElement(FaFileExcel);
    default:
      return createElement(FaFile);
  }
};
