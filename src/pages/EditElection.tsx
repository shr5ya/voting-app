import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EditElection: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-100 py-12 px-2">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-yellow-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">Edit Election</h1>
        <div className="max-w-xl mx-auto">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-yellow-300 bg-white/80">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Calendar className="w-10 h-10 text-yellow-500" />
              <CardTitle className="text-2xl font-bold leading-tight mb-1">Edit Election</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input placeholder="Election Title" />
                <Input placeholder="Description" />
                <div className="flex gap-2">
                  <Input type="date" className="w-1/2" />
                  <Input type="date" className="w-1/2" />
                </div>
                <Button className="w-full mt-4">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EditElection; 