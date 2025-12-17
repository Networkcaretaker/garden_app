{/* Gallery */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('gallery')}
                className="w-full flex justify-between items-center p-6 bg-white"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-teal-500" /> Gallery
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['gallery'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['gallery'] ? 'block' : 'hidden'}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={settings.content?.gallery?.title || ''}
                            onChange={(e) => handleContentChange('gallery', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={settings.content?.gallery?.text || ''}
                            onChange={(e) => handleContentChange('gallery', 'text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="A description of this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add Project</label>
                        <select
                            value=""
                            onChange={(e) => handleAddGalleryProject(e.target.value)}
                            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="" disabled>Select a project to add...</option>
                            {activeProjects
                                .filter(p => !settings.content?.gallery?.projects?.includes(p.id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))
                            }
                        </select>
                        <div className="space-y-2 mb-4">
                            {settings.content?.gallery?.projects?.map(projectId => {
                                const project = projects?.find(p => p.id === projectId);
                                return (
                                    <div key={projectId} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <span className={`text-sm font-medium ${project ? 'text-gray-700' : (!projects ? 'text-gray-400' : 'text-red-500')}`}>
                                            {project ? project.title : (!projects ? 'Loading...' : 'Unknown Project')}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryProject(projectId)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                            {(!settings.content?.gallery?.projects || settings.content.gallery.projects.length === 0) && (
                                <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    No projects selected for the gallery.
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div> 