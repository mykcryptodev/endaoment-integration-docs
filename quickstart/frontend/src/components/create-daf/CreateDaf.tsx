import { useState } from 'react';

interface CreateDafFormData {
  name: string;
  description: string;
  fundAdvisor: string;
}

export const CreateDaf = () => {
  const [formData, setFormData] = useState<CreateDafFormData>({
    name: '',
    description: '',
    fundAdvisor: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/create-daf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create DAF');
      }

      const data = await response.json();
      // Handle success (e.g., show success message, redirect)
      console.log('DAF created:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Create a New DAF</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Fund Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter fund name"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Fund Advisor</span>
              </label>
              <input
                type="text"
                name="fundAdvisor"
                value={formData.fundAdvisor}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter fund advisor"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered h-32"
                placeholder="Enter fund description"
                required
              />
            </div>

            <div className="card-actions justify-end">
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create DAF'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 