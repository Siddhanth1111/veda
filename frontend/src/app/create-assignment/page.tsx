import { CreateAssignmentForm } from '@/components/CreateAssignmentForm';

export default function CreateAssignmentPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full">
        <CreateAssignmentForm />
      </div>
    </main>
  );
}