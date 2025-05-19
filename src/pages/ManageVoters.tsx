import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ManageVoters: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-100 py-12 px-2">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">Manage Voters</h1>
        <div className="max-w-xl mx-auto">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-green-300 bg-white/80">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Users className="w-10 h-10 text-green-500" />
              <CardTitle className="text-2xl font-bold leading-tight mb-1">Voter Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 mb-2 text-center">Voter management tools will be available here soon.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ManageVoters; 