import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { testimonialsAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { XMarkIcon, StarIcon } from "@heroicons/react/24/outline";

const schema = yup
  .object({
    client_name: yup.string().required("Client name is required"),
    company: yup.string(),
    position: yup.string(),
    content: yup.string().required("Testimonial content is required"),
    rating: yup.number().min(1).max(5).required("Rating is required"),
    is_featured: yup.mixed().oneOf([0, 1, "0", "1"]).required(),
    display_order: yup.number().min(0),
  })
  .required();

export default function TestimonialModal({
  isOpen,
  onClose,
  testimonial,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: testimonial || {
      rating: 5,
      is_featured: false,
      display_order: 0,
      is_active: true,
    },
  });
  useEffect(() => {
    if (testimonial) {
      reset({
        client_name: testimonial.client_name || "",
        company: testimonial.company || "",
        position: testimonial.position || "",
        content: testimonial.content || "",
        rating: Number(testimonial.rating) || 5,
        is_featured: Number(testimonial.is_featured) === 1,
        display_order: testimonial.display_order || 0,
        is_active: Number(testimonial.is_active) === 1,
      });
    } else {
      reset({
        client_name: "",
        company: "",
        position: "",
        content: "",
        rating: 5,
        is_featured: false,
        display_order: 0,
        is_active: true,
      });
    }
  }, [testimonial, reset]);

  const rating = watch("rating", testimonial?.rating || 5);

  const onSubmit = async (data) => {
    try {
      if (testimonial) {
        await testimonialsAPI.update(testimonial.id, data);
        toast.success("Testimonial updated successfully");
      } else {
        await testimonialsAPI.create(data);
        toast.success("Testimonial created successfully");
      }

      onSuccess();
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setValue("rating", i + 1, { shouldValidate: true })}
        className="focus:outline-none"
      >
        <StarIcon
          className={`h-8 w-8 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      </button>
    ));
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

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
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
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register("client_name")}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.client_name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.client_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.client_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    {...register("company")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  {...register("position")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="CEO, Manager, etc."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Testimonial Content *
                </label>
                <textarea
                  {...register("content")}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="What did the client say about your service?"
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Rating *
                </label>
                <div className="flex items-center mb-4 space-x-2">
                  {renderStars()}
                  <span className="ml-2 text-lg font-semibold">{rating}/5</span>
                </div>
                <input type="hidden" {...register("rating")} />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <input type="hidden" value="0" {...register("is_featured")} />

                  <input
                    type="checkbox"
                    value="1"
                    {...register("is_featured")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="block ml-2 text-sm text-gray-900">
                    Mark as Featured
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <input type="hidden" value="0" {...register("is_active")} />

                <input
                  type="checkbox"
                  value="1"
                  {...register("is_active")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />

                <label className="block ml-2 text-sm text-gray-900">
                  Active
                </label>
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
                  {testimonial ? "Update Testimonial" : "Create Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
