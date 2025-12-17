{/* Testimonials */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('testimonials')}
                className="w-full flex justify-between items-center p-6 bg-white"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageCircleMore className="h-5 w-5 text-teal-500" /> Testimonials
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['testimonials'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['testimonials'] ? 'block' : 'hidden'}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={settings.content?.testimonials?.title || ''}
                            onChange={(e) => handleContentChange('testimonials', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={settings.content?.testimonials?.text || ''}
                            onChange={(e) => handleContentChange('testimonials', 'text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="A description of this section"
                        />
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium text-gray-900">Clients</h3>
                            <button
                                type="button"
                                onClick={addTestimonialClient}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100"
                            >
                                <Plus className="h-3 w-3" /> Add Client
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {settings.content?.testimonials?.clients?.map((client, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                                    <button
                                        type="button"
                                        onClick={() => removeTestimonialClient(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Client Name</label>
                                            <input
                                                type="text"
                                                value={client.name}
                                                onChange={(e) => handleTestimonialClientChange(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Occupation / Role</label>
                                            <input
                                                type="text"
                                                value={client.occupation}
                                                onChange={(e) => handleTestimonialClientChange(index, 'occupation', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Testimonial Text</label>
                                            <textarea
                                                rows={2}
                                                value={client.text}
                                                onChange={(e) => handleTestimonialClientChange(index, 'text', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {(!settings.content?.testimonials?.clients || settings.content.testimonials.clients.length === 0) && (
                                <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    No testimonials added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>