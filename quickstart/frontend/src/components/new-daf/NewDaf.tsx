import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';

export const NewDaf = () => {
  const {
    mutate: createDaf,
    isIdle,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ['Create DAF'],
    mutationFn: async (formData: FormData) => {
      const rawFormObject = Object.fromEntries(formData.entries());

      const cleanedForm = {
        name: rawFormObject['name'],
        description: rawFormObject['description'],
        fundAdvisor: {
          firstName: rawFormObject['fundAdvisor.firstName'],
          lastName: rawFormObject['fundAdvisor.lastName'],
          email: rawFormObject['fundAdvisor.email'],
          address: {
            line1: rawFormObject['fundAdvisor.address.line1'],
            line2: rawFormObject['fundAdvisor.address.line2'],
            city: rawFormObject['fundAdvisor.address.city'],
            state: rawFormObject['fundAdvisor.address.state'],
            zip: rawFormObject['fundAdvisor.address.zip'],
            country: rawFormObject['fundAdvisor.address.country'],
          },
        },
      };

      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/create-daf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedForm),
          credentials: 'include',
        }
      );

      return response.json();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createDaf(new FormData(e.currentTarget));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Create a New DAF</h2>
          
          <form id="create-daf-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Fund Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-base-300"></div>
                <span className="text-lg font-semibold text-base-content/70">Fund Information</span>
                <div className="h-px flex-1 bg-base-300"></div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="sr-only label-text font-medium">Fund Name</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="input input-bordered w-full"
                  placeholder="Enter fund name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="sr-only label-text font-medium">Fund Description</span>
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  required 
                  className="textarea textarea-bordered h-32 w-full"
                  placeholder="Enter fund description"
                ></textarea>
              </div>
            </div>

            {/* Advisor Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-base-300"></div>
                <span className="text-lg font-semibold text-base-content/70">Advisor Information</span>
                <div className="h-px flex-1 bg-base-300"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="sr-only label-text font-medium">First Name</span>
                  </label>
                  <input
                    type="text"
                    id="fundAdvisor.firstName"
                    name="fundAdvisor.firstName"
                    required
                    className="input input-bordered"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="sr-only label-text font-medium">Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="fundAdvisor.lastName"
                    name="fundAdvisor.lastName"
                    required
                    className="input input-bordered"
                    placeholder="Enter last name"
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="sr-only label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    id="fundAdvisor.email"
                    name="fundAdvisor.email"
                    required
                    className="input input-bordered"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-base-300"></div>
                <span className="text-lg font-semibold text-base-content/70">Address</span>
                <div className="h-px flex-1 bg-base-300"></div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="sr-only label-text font-medium">Address Line 1</span>
                </label>
                <input
                  type="text"
                  id="fundAdvisor.address.line1"
                  name="fundAdvisor.address.line1"
                  required
                  className="input input-bordered"
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="sr-only label-text font-medium">Address Line 2</span>
                </label>
                <input
                  type="text"
                  id="fundAdvisor.address.line2"
                  name="fundAdvisor.address.line2"
                  className="input input-bordered"
                  placeholder="Enter apartment, suite, etc. (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="sr-only label-text font-medium">City</span>
                  </label>
                  <input
                    type="text"
                    id="fundAdvisor.address.city"
                    name="fundAdvisor.address.city"
                    required
                    className="input input-bordered"
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="sr-only label-text font-medium">State</span>
                  </label>
                  <input
                    type="text"
                    id="fundAdvisor.address.state"
                    name="fundAdvisor.address.state"
                    required
                    className="input input-bordered"
                    placeholder="Enter state"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="sr-only label-text font-medium">ZIP Code</span>
                  </label>
                  <input
                    type="text"
                    id="fundAdvisor.address.zip"
                    name="fundAdvisor.address.zip"
                    required
                    className="input input-bordered"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="sr-only label-text font-medium">Country</span>
                </label>
                <input
                  type="text"
                  id="fundAdvisor.address.country"
                  name="fundAdvisor.address.country"
                  required
                  className="input input-bordered"
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="card-actions justify-end pt-4">
              {isIdle || isError ? (
                <button 
                  type="submit" 
                  className={`btn ${isError ? 'btn-error' : 'btn-primary'}`}
                >
                  {isIdle && 'Create DAF'}
                  {isError && 'Error Creating DAF, Try Again'}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Creating DAF...</span>
                    </>
                  )}
                  {isSuccess && (
                    <div className="text-success flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>DAF Created!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
