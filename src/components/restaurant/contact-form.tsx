"use client";

import React from "react";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("In development. Will start working when domain is registered.");
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label
            htmlFor="firstName"
            className="block text-[15px] text-stone-800"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            required
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3.5 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-shadow"
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="lastName"
            className="block text-[15px] text-stone-800"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3.5 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label htmlFor="email" className="block text-[15px] text-stone-800">
            E-mail Add. <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3.5 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-shadow"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="phone" className="block text-[15px] text-stone-800">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            required
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3.5 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-shadow"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="message" className="block text-[15px] text-stone-800">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          className="w-full rounded-md border border-stone-200 bg-white px-4 py-4 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-shadow resize-none"
        ></textarea>
      </div>

      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="submit"
          className="rounded-md bg-[#a3adb8] px-8 py-2 text-[15px] font-medium text-stone-900 hover:bg-[#8f98a3] transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
