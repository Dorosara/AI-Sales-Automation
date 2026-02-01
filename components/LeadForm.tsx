import React from 'react';
import { LeadData } from '../types';
import { User, Building2, Briefcase, AlertCircle, MessageSquare, Globe, Target, Clock } from 'lucide-react';

interface LeadFormProps {
  leadData: LeadData;
  onChange: (key: keyof LeadData, value: string) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ leadData, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name as keyof LeadData, e.target.value);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
        <User className="text-blue-500 dark:text-blue-400" />
        Lead Context
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Prospect Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="name"
              value={leadData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Johnson"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Job Role</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="role"
              value={leadData.role}
              onChange={handleChange}
              placeholder="e.g. VP of Sales"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>

        {/* Company */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Company</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="company"
              value={leadData.company}
              onChange={handleChange}
              placeholder="e.g. TechFlow Inc."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>

         {/* Industry */}
         <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Industry</label>
          <div className="relative">
            <Target className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="industry"
              value={leadData.industry}
              onChange={handleChange}
              placeholder="e.g. SaaS / Healthcare"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>

        {/* Language */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Language</label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="language"
              value={leadData.language}
              onChange={handleChange}
              placeholder="e.g. English (US)"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tone */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Tone</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <select
              name="tone"
              value={leadData.tone}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors appearance-none"
            >
              <option value="Friendly">Friendly</option>
              <option value="Professional">Professional</option>
              <option value="Confident">Confident</option>
              <option value="Direct">Direct</option>
              <option value="Warm">Warm</option>
            </select>
          </div>
        </div>

        {/* Days Ago */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Days Since Contact</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="number"
              name="daysAgo"
              value={leadData.daysAgo}
              onChange={handleChange}
              placeholder="e.g. 3"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Pain Point */}
      <div className="space-y-1 mt-4">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Main Pain Point</label>
        <div className="relative">
          <AlertCircle className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            name="painPoint"
            value={leadData.painPoint}
            onChange={handleChange}
            placeholder="e.g. Low conversion rates on cold emails"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          />
        </div>
      </div>

      {/* Product Description */}
      <div className="space-y-1 mt-4">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Product / Offer Description</label>
        <textarea
          name="productDescription"
          value={leadData.productDescription}
          onChange={handleChange}
          rows={3}
          placeholder="Describe your product or service..."
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-3 px-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
        />
      </div>
    </div>
  );
};

export default LeadForm;