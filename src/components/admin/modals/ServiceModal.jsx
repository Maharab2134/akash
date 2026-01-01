import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { servicesAPI } from "../../../services/api";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AVAILABLE_ICONS } from "../../../constants/serviceIcons";

import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    slug: yup.string(),
    short_description: yup.string().required("Short description is required"), // ✅ short_description
    full_description: yup.string(),
    icon: yup.string().required("Icon is required"),
    featured: yup.boolean(),
    is_active: yup.boolean(),
    display_order: yup.number().min(0),
    meta_title: yup.string(),
    meta_description: yup.string(),
    meta_keywords: yup.string(),
  })
  .required();

export default function ServiceModal({ isOpen, onClose, service, onSuccess }) {
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
    icon: "",
  });
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      icon: "fas fa-code",
      featured: false,
      is_active: true,
      display_order: 0,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    },
  });

  // Load service data when modal opens
  useEffect(() => {
    const loadServiceData = async () => {
      if (!service) return;

      setIsLoading(true);
      try {
        const response = await servicesAPI.getById(service.id);

        // ✅ FINAL FIX
        const serviceData = response?.data ?? response;
        if (!serviceData) {
          throw new Error("Service data missing");
        }

        reset({
          title: serviceData.title || "",
          slug: serviceData.slug || "",
          short_description: serviceData.short_description || "",
          full_description: serviceData.full_description || "",
          icon: serviceData.icon || "fas fa-code",
          featured: !!serviceData.featured,
          is_active: !!serviceData.is_active,
          display_order: serviceData.display_order || 0,
          meta_title: serviceData.meta_title || "",
          meta_description: serviceData.meta_description || "",
          meta_keywords: serviceData.meta_keywords || "",
        });

        setFeatures(
          (serviceData.features || []).map((f) => ({
            id: f.id,
            title: f.title || "",
            description: f.description || f.short_description || "",
            icon: f.icon || "",
          }))
        );
      } catch (error) {
        toast.error("Failed to load service data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadServiceData();
    }
  }, [service, isOpen, reset]);

  const titleValue = watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (!service && titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [titleValue, service, setValue]);

  const addFeature = () => {
    if (newFeature.title.trim()) {
      const feature = {
        ...newFeature,
        id: editingFeatureId || Date.now(),
      };

      if (editingFeatureId) {
        // Update existing feature
        setFeatures(
          features.map((f) => (f.id === editingFeatureId ? feature : f))
        );
        setEditingFeatureId(null);
      } else {
        // Add new feature
        setFeatures([...features, feature]);
      }

      setNewFeature({ title: "", description: "", icon: "" });
    }
  };

  const editFeature = (feature) => {
    setNewFeature({
      title: feature.title,
      description: feature.description || "",
      icon: feature.icon || "",
    });
    setEditingFeatureId(feature.id);
  };

  const removeFeature = (id) => {
    setFeatures(features.filter((f) => f.id !== id));
    if (editingFeatureId === id) {
      setEditingFeatureId(null);
      setNewFeature({ title: "", description: "", icon: "" });
    }
  };

  const cancelEditFeature = () => {
    setEditingFeatureId(null);
    setNewFeature({ title: "", description: "", icon: "" });
  };

  const onSubmit = async (data) => {
    try {
      // Prepare features for API
      const apiFeatures = features.map((feature, index) => ({
        title: feature.title,
        description: feature.description || "",
        icon: feature.icon || "",
        display_order: index,
      }));

      const payload = {
        ...data,
        features: apiFeatures,
      };

      if (service) {
        await servicesAPI.update(service.id, payload);
        toast.success("Service updated successfully");
      } else {
        await servicesAPI.create(payload);
        toast.success("Service created successfully");
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save service");
    }
  };

  const handleClose = () => {
    reset();
    setFeatures([]);
    setNewFeature({ title: "", description: "", icon: "" });
    setEditingFeatureId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        onClick={handleClose}
      ></div>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {service ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      {...register("title")}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Slug *
                    </label>
                    <input
                      type="text"
                      {...register("slug")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="web-development"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Auto-generated from title if left empty
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Service Icon <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-4 gap-3">
                      {AVAILABLE_ICONS.map((item) => {
                        const IconComponent = item.component;
                        const selected = watch("icon") === item.value;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setValue("icon", item.value)}
                            className={`flex flex-col items-center p-3 border rounded-lg transition
            ${
              selected
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
                          >
                            <IconComponent className="w-6 h-6 text-blue-600" />
                            <span className="mt-1 text-xs text-gray-700">
                              {item.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {errors.icon && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.icon.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Display Order
                    </label>
                    <input
                      type="number"
                      {...register("display_order")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Short Description *
                  </label>
                  <textarea
                    {...register("short_description")}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.short_description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Brief description of the service"
                  />
                  {errors.short_description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.short_description.message}
                    </p>
                  )}
                </div>

                <div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Detailed Description
                    </label>

                    <ReactQuill
                      theme="snow"
                      value={watch("full_description")}
                      onChange={(value) => setValue("full_description", value)}
                      modules={quillModules}
                      placeholder="Write full service description here..."
                      className="bg-white"
                    />
                  </div>
                </div>

                {/* Features Section */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      Features
                    </h4>
                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {features.length} features added
                    </span>
                  </div>

                  <div className="mb-4 space-y-4">
                    {features.map((feature, index) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg">
                            {feature.icon ? (
                              <i
                                className={`${feature.icon} text-gray-600`}
                              ></i>
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{feature.title}</div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => editFeature(feature)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFeature(feature.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {feature.description}
                          </div>
                          {feature.icon && (
                            <div className="mt-1 text-xs text-gray-500">
                              <i className={`${feature.icon} mr-1`}></i>
                              {feature.icon}
                            </div>
                          )}
                          <div className="mt-1 text-xs text-gray-400">
                            Order: {index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add/Edit Feature Form */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h5 className="mb-3 font-medium text-gray-900">
                      {editingFeatureId ? "Edit Feature" : "Add New Feature"}
                    </h5>
                    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={newFeature.title}
                          onChange={(e) =>
                            setNewFeature({
                              ...newFeature,
                              title: e.target.value,
                            })
                          }
                          placeholder="Feature title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          type="text"
                          value={newFeature.description}
                          onChange={(e) =>
                            setNewFeature({
                              ...newFeature,
                              description: e.target.value,
                            })
                          }
                          placeholder="Feature description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Icon Class
                        </label>
                        <input
                          type="text"
                          value={newFeature.icon}
                          onChange={(e) =>
                            setNewFeature({
                              ...newFeature,
                              icon: e.target.value,
                            })
                          }
                          placeholder="fas fa-check"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={addFeature}
                        disabled={!newFeature.title.trim()}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        {editingFeatureId ? "Update Feature" : "Add Feature"}
                      </button>
                      {editingFeatureId && (
                        <button
                          type="button"
                          onClick={cancelEditFeature}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      {...register("meta_title")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO meta title"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Meta Description
                    </label>
                    <textarea
                      {...register("meta_description")}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO meta description"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      {...register("meta_keywords")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="web development, custom solutions"
                    />
                  </div>
                </div>

                <div className="flex items-center pt-6 space-x-6 border-t">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register("featured")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="featured"
                      className="block ml-2 text-sm font-medium text-gray-900"
                    >
                      Featured Service
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      {...register("is_active")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="is_active"
                      className="block ml-2 text-sm font-medium text-gray-900"
                    >
                      Active Service
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-6 space-x-3 border-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    {service ? "Update Service" : "Create Service"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
