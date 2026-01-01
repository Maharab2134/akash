import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialsAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  UserIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import TestimonialModal from "../../components/admin/modals/TestimonialModal";

export default function AdminTestimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials", { search, filter }],
    queryFn: async () => {
      const res = await testimonialsAPI.getAll({
        search,
        featured: filter === "featured" ? 1 : "",
      });

      return Array.isArray(res.data) ? res.data : res.data.data;
    },
  });

  console.log("QUERY DATA:", data);

  const testimonials = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id) => testimonialsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to delete testimonial"
      );
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id) => testimonialsAPI.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">
            Manage client testimonials and reviews
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedTestimonial(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm sm:mt-0 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Testimonial
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search testimonials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Testimonials</option>
              <option value="featured">Featured Only</option>
              <option value="5-star">5 Star Ratings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-gray-400">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No testimonials found
            </h3>
            <p className="text-gray-500">
              Get started by adding your first testimonial.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                  Number(testimonial.is_featured) === 1
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.client_name}
                          className="object-cover w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                          <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {testimonial.client_name}
                      </h3>

                      <div className="flex items-center text-gray-600">
                        <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">{testimonial.company}</span>
                        {testimonial.position && (
                          <span className="ml-2 text-sm text-gray-500">
                            • {testimonial.position}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="mb-6 italic text-gray-700">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      toggleFeaturedMutation.mutate(testimonial.id)
                    }
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      Number(testimonial.is_featured) === 1
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {Number(testimonial.is_featured) === 1
                      ? "⭐ Featured"
                      : "Make Featured"}
                  </button>

                  <span className="text-sm text-gray-500">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTestimonial(null);
        }}
        testimonial={selectedTestimonial}
        onSuccess={() => {
          queryClient.invalidateQueries(["testimonials"]);
          setIsModalOpen(false);
          setSelectedTestimonial(null);
        }}
      />
    </div>
  );
}
