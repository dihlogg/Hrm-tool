"use client";

import React, { useState } from "react";
import { Button, message, notification } from "antd";
import { useAddSkill } from "@/hooks/ats/skills/useAddSkill";
import { SkillDto } from "@/hooks/ats/skills/SkillDto";

export default function AddSkillPage() {
  const { addSkill } = useAddSkill();

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    category?: string;
  }>({});
  const [api, contextHolder] = notification.useNotification();
  
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const resetForm = () => {
    setName("");
    setCategory("");
  };

  const handleSubmit = async () => {
    const errors: typeof formErrors = {};

    if (!name.trim()) errors.name = "Skill Name is required";
    if (!category.trim()) errors.category = "Category is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.warning("Please fill in all required fields properly before submitting!");
      return;
    }
    
    try {
      const payload: SkillDto = {
        name,
        category,
      };

      await addSkill(payload);
      api.success({
        message: "Skill created successfully!",
        description: `The skill has been added to the dictionary.`,
        placement: "bottomLeft",
      });
      resetForm();
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }
      api.error({
        message: "Skill creation failed!",
        description: errorMessage,
        placement: "bottomLeft",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-gray-400">
            Add Skill
          </h2>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-col w-full py-4 border-gray-200 rounded-lg sm:flex-row">
              <div className="grid grid-cols-1 gap-8 mb-6 sm:grid-cols-2 lg:grid-cols-2">

                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Skill Name*
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="e.g. ReactJS, Leadership"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                  />
                  {formErrors.name && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Category*
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="e.g. Frontend, Soft Skill"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setFormErrors((prev) => ({ ...prev, category: undefined }));
                    }}
                  />
                  {formErrors.category && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.category}
                    </span>
                  )}
                </div>

              </div>
              <div className="flex items-center justify-between mt-8">
                <span className="text-sm italic font-medium text-gray-500">
                  * Required
                </span>
                <Button
                  type="primary"
                  shape="round"
                  size="middle"
                  className="text-white bg-blue-500 hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  + Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
