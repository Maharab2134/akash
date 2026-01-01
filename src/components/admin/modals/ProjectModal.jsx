import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { projectsAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    slug: yup.string(),
    description: yup.string().required("Description is required"),
    client_name: yup.string().required("Client name is required"),
    category: yup.string().required("Category is required"),
    project_url: yup.string().url("Must be a valid URL"),
    start_date: yup.string(),
    end_date: yup.string(),
    featured: yup.boolean(),
    display_order: yup.number().min(0),
  })
  .required();

export default function ProjectModal({ isOpen, onClose, project, onSuccess }) {
  const [technologies, setTechnologies] = useState([]);
  const [features, setFeatures] = useState(project?.features || []);
  const [gallery, setGallery] = useState(project?.gallery || []);
  const [newTech, setNewTech] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: project || {
      featured: false,
      display_order: 0,
      is_active: true,
    },
  });
  useEffect(() => {
    if (project) {
      reset({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        client_name: project.client_name || "",
        category: project.category || "",
        project_url: project.project_url || "",
        cover_image: project.cover_image || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        featured: project.featured ?? false,
        display_order: project.display_order ?? 0,
        is_active: project.is_active ?? true,
        challenge: project.challenge || "",
        solution: project.solution || "",
        result: project.result || "",
      });

      // ✅ SAFE ARRAY CONVERSION
      const parseTechnologies = () => {
        if (Array.isArray(project.technologies)) return project.technologies;
        if (typeof project.technologies === "string") {
          try {
            const parsed = JSON.parse(project.technologies);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return project.technologies.split(",").map((t) => t.trim());
          }
        }
        return [];
      };

      const parseFeatures = () => {
        if (Array.isArray(project.features)) return project.features;
        if (typeof project.features === "string") {
          try {
            const parsed = JSON.parse(project.features);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return project.features.split(",").map((f) => f.trim());
          }
        }
        return [];
      };

      const parseGallery = () => {
        if (Array.isArray(project.gallery)) return project.gallery;
        if (typeof project.gallery === "string") {
          try {
            const parsed = JSON.parse(project.gallery);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      setTechnologies(parseTechnologies());
      setFeatures(parseFeatures());
      setGallery(parseGallery());
    } else {
      reset({
        title: "",
        slug: "",
        description: "",
        client_name: "",
        category: "",
        project_url: "",
        start_date: "",
        end_date: "",
        featured: false,
        display_order: 0,
        is_active: true,
        challenge: "",
        solution: "",
        result: "",
      });

      setTechnologies([]);
      setFeatures([]);
      setGallery([]);
    }
  }, [project, reset]);

  const addTechnology = () => {
    if (newTech.trim()) {
      setTechnologies([...technologies, newTech]);
      setNewTech("");
    }
  };

  const removeTechnology = (index) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature]);
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setGallery([...gallery, newImage]);
      setNewImage("");
    }
  };

  const removeImage = (index) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title?.trim(),
        slug: data.slug?.trim() || null,
        client_name: data.client_name?.trim(),
        category: data.category,
        description: data.description?.trim(),
        cover_image: data.cover_image?.trim() || null,
        challenge: data.challenge?.trim() || null,
        solution: data.solution?.trim() || null,
        result: data.result?.trim() || null,
        project_url: data.project_url?.trim() || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        featured: data.featured ? 1 : 0,
        display_order: Number(data.display_order || 0),
        is_active: data.is_active ? 1 : 0,

        technologies,
        features,
        gallery,
      };

      // ❗ remove empty keys (but keep null values for database)
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      console.log("FINAL PAYLOAD", payload);

      if (project) {
        const res = await projectsAPI.update(project.id, payload);
        console.log("UPDATE RESPONSE", res);
        toast.success("Project updated successfully");
      } else {
        await projectsAPI.create(payload);
        toast.success("Project created successfully");
      }

      onSuccess();
      reset();
      setTechnologies([]);
      setFeatures([]);
      setGallery([]);
    } catch (error) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.SQL_EXECUTE_ERROR ||
          "Operation failed"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {project ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="E-Commerce Platform"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    {...register("slug")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e-commerce-platform"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-generated from title if left empty
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register("client_name")}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.client_name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Client Company"
                  />
                  {errors.client_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.client_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Project description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    {...register("category")}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Project URL
                  </label>
                  <input
                    type="url"
                    {...register("project_url")}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.project_url ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.project_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.project_url.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  {...register("cover_image")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/cover-image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This image will be used as project thumbnail
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register("start_date")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register("end_date")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Technologies Used
                </label>
                <div className="mb-4 space-y-2">
                  {Array.isArray(technologies) &&
                    technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology (e.g., React, Node.js)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Key Features
                </label>
                <div className="mb-4 space-y-2">
                  {Array.isArray(features) &&
                    features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add key feature"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Gallery Images
                </label>
                <div className="mb-4 space-y-2">
                  {Array.isArray(gallery) &&
                    gallery.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                      >
                        <span className="truncate">{image}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("featured")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="block ml-2 text-sm text-gray-900">
                    Featured Project
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("is_active")}
                    defaultChecked
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="block ml-2 text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>

              {/* Challenge, Solution, Result */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    The Challenge
                  </label>
                  <textarea
                    {...register("challenge")}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What challenges did the client face?"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Our Solution
                  </label>
                  <textarea
                    {...register("solution")}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="How did we solve the challenges?"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    The Result
                  </label>
                  <textarea
                    {...register("result")}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What were the outcomes and results?"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 space-x-3 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {project ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
