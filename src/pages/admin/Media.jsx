import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

export default function AdminMedia() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["media", { page, search, type: typeFilter }],
    queryFn: () =>
      mediaAPI.getAll({
        page,
        search,
        type: typeFilter,
        limit: 20,
      }),
    keepPreviousData: true,
    enabled: true,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData) => mediaAPI.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to upload file");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => mediaAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setSelectedFiles([]);
      toast.success("File deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete file");
    },
  });

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    uploadMutation.mutate(formData);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = () => {
    if (selectedFiles.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedFiles.length} file(s)?`
      )
    ) {
      selectedFiles.forEach((id) => {
        deleteMutation.mutate(id);
      });
    }
  };

  const toggleFileSelection = (id) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
    );
  };

  const media = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination || {};
  console.log("MEDIA QUERY RESULT:", data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Media Library
          </h1>
          <p className="text-gray-600">Manage all your uploaded media files</p>
        </div>
        <div className="flex mt-4 space-x-3 sm:mt-0">
          <button
            onClick={handleDelete}
            disabled={selectedFiles.length === 0 || deleteMutation.isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Delete Selected ({selectedFiles.length})
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {uploadMutation.isLoading ? (
              <>
                <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                Upload Files
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search media files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
              </select>
              <FunnelIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : media.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-gray-400">
              <PhotoIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No media files found
            </h3>
            <p className="text-gray-500">
              Upload your first file to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {media.map((file) => (
                <div
                  key={file.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                    selectedFiles.includes(file.id)
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="relative flex items-center justify-center bg-gray-100 aspect-square">
                    {file.file_type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.alt_text || file.file_name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="p-4 text-center">
                        <DocumentIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <div className="px-2 text-xs text-gray-500 truncate">
                          {file.file_name}
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFileSelection(file.id);
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="mb-1 text-xs font-medium text-gray-900 truncate">
                      {file.file_name}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {file.file_type === "image" ? "Image" : "Document"}
                      </span>
                      <span>
                        {(file.file_size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex justify-between flex-1 sm:hidden">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.pages}
                      className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(page - 1) * 20 + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(page * 20, pagination.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{pagination.total}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                        {[...Array(pagination.pages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === i + 1
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Guidelines */}
      <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
        <h3 className="mb-3 text-lg font-semibold text-blue-900">
          Upload Guidelines
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <span>
              Maximum file size: <strong>10MB</strong>
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            <span>
              Supported image formats: <strong>JPG, PNG, GIF, WebP</strong>
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <span>
              Supported document formats: <strong>PDF, DOC, DOCX</strong>
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-bold text-blue-600">4</span>
            </div>
            <span>
              Recommended image dimensions: <strong>1920x1080 pixels</strong>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
