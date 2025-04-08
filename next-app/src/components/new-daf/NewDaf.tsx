'use client';

import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';

export const NewDaf = () => {
  const {
    mutate: createDaf,
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

      const response = await fetch('/api/create-daf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedForm),
        credentials: 'include',
      });

      return response.json();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createDaf(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Create a New DAF</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">DAF Information</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Fund Advisor Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  name="fundAdvisor.firstName"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  name="fundAdvisor.lastName"
                  className="input input-bordered"
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="fundAdvisor.email"
                className="input input-bordered"
                required
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Address</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address Line 1</span>
              </label>
              <input
                type="text"
                name="fundAdvisor.address.line1"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address Line 2</span>
              </label>
              <input
                type="text"
                name="fundAdvisor.address.line2"
                className="input input-bordered"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  name="fundAdvisor.address.city"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">State</span>
                </label>
                <input
                  type="text"
                  name="fundAdvisor.address.state"
                  className="input input-bordered"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ZIP Code</span>
                </label>
                <input
                  type="text"
                  name="fundAdvisor.address.zip"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Country</span>
                </label>
                <input
                  type="text"
                  name="fundAdvisor.address.country"
                  className="input input-bordered"
                  defaultValue="US"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create DAF'}
          </button>
        </div>

        {isSuccess && (
          <div className="alert alert-success">
            <span>DAF created successfully!</span>
          </div>
        )}

        {isError && (
          <div className="alert alert-error">
            <span>Error creating DAF. Please try again.</span>
          </div>
        )}
      </form>
    </div>
  );
}; 