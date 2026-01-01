import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { teamAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    position: yup.string().required("Position is required"),
    bio: yup.string().required("Bio is required"),
    email: yup.string().email("Invalid email"),
    phone: yup.string(),
    avatar: yup.string().url("Must be a valid URL"),
    display_order: yup.number().min(0),
    is_active: yup.boolean(),
  })
  .required();

export default function TeamModal({ isOpen, onClose, member, onSuccess }) {
  const [expertise, setExpertise] = useState(member?.expertise || []);
  const [socialLinks, setSocialLinks] = useState(
    member?.social_links || {
      linkedin: "",
      twitter: "",
      github: "",
      dribbble: "",
    }
  );
  const [newExpertise, setNewExpertise] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: member || {
      is_active: true,
      display_order: 0,
    },
  });
  useEffect(() => {
  if (member) {
    reset({
      name: member.name || "",
      position: member.position || "",
      bio: member.bio || "",
      email: member.email || "",
      phone: member.phone || "",
      avatar: member.avatar || "",
      display_order: member.display_order || 0,
      is_active: Boolean(member.is_active),
    });

    setExpertise(member.expertise || []);
    setSocialLinks(
      member.social_links || {
        linkedin: "",
        github: "",
        twitter: "",
        dribbble: "",
      }
    );
  } else {
    reset({
      name: "",
      position: "",
      bio: "",
      email: "",
      phone: "",
      avatar: "",
      display_order: 0,
      is_active: true,
    });

    setExpertise([]);
    setSocialLinks({
      linkedin: "",
      github: "",
      twitter: "",
      dribbble: "",
    });
  }
}, [member, reset]);


  const addExpertise = () => {
    if (newExpertise.trim()) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (index) => {
    setExpertise(expertise.filter((_, i) => i !== index));
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks({
      ...socialLinks,
      [platform]: value,
    });
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        expertise,
        social_links: socialLinks,
        is_active: data.is_active ? 1 : 0,
      };

      if (member) {
        await teamAPI.update(member.id, payload);
        toast.success("Team member updated successfully");
      } else {
        await teamAPI.create(payload);
        toast.success("Team member created successfully");
      }

      onSuccess();
      reset();
      setExpertise([]);
      setSocialLinks({
        linkedin: "",
        twitter: "",
        github: "",
        dribbble: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
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

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {member ? "Edit Team Member" : "Add Team Member"}
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Position *
                  </label>
                  <input
                    type="text"
                    {...register("position")}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.position ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Senior Developer"
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.position.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bio *
                </label>
                <textarea
                  {...register("bio")}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.bio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tell us about this team member..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Avatar URL
                </label>
                <input
                  type="url"
                  {...register("avatar")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* Expertise */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Areas of Expertise
                </label>
                <div className="mb-4 space-y-2">
                  {expertise.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-gray-50"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
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
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Add an expertise (e.g., React, UI/UX)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  Social Media Links
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin}
                      onChange={(e) =>
                        handleSocialLinkChange("linkedin", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter}
                      onChange={(e) =>
                        handleSocialLinkChange("twitter", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={socialLinks.github}
                      onChange={(e) =>
                        handleSocialLinkChange("github", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Dribbble
                    </label>
                    <input
                      type="url"
                      value={socialLinks.dribbble}
                      onChange={(e) =>
                        handleSocialLinkChange("dribbble", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://dribbble.com/username"
                    />
                  </div>
                </div>
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
                  {member ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
