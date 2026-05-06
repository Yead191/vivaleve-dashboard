import React from 'react';
import { Form, Input, Button, } from 'antd';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { toast } from 'sonner';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Reset password values:', values);
    toast.success('Password reset successfully! Please login with your new password.');
    navigate('/login');
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your identity has been verified. Now you can set a new secure password for your account."
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-5"
      >
        <Form.Item
          label={<span className="text-xs font-semibold uppercase tracking-wider text-gray-500">New Password</span>}
          name="password"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />}
            placeholder="••••••••"
            className="h-12 rounded-xl border-gray-200 hover:border-[#429CA8] focus:border-[#429CA8]"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Confirm Password</span>}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />}
            placeholder="••••••••"
            className="h-12 rounded-xl border-gray-200 hover:border-[#429CA8] focus:border-[#429CA8]"
          />
        </Form.Item>

        <Form.Item className="mb-0 pt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 bg-[#429CA8] hover:bg-[#367d87] rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-none shadow-lg shadow-[#429CA8]/20"
          >
            Update Password
            <ShieldCheck className="w-4 h-4" />
          </Button>
        </Form.Item>

        <div className="text-center pt-2">
          <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-[#429CA8] flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
}
