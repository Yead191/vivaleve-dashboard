import React from 'react';
import { Form, Input, Button, Checkbox, } from 'antd';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Login values:', values);
    toast.success('Successfully logged in!');
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to VivaLeve admin console"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-4"
      >
        <Form.Item
          label={<span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</span>}
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input
            prefix={<Mail className="w-4 h-4 text-gray-400 mr-2" />}
            placeholder="admin@vivaleve.com"
            className="h-12 rounded-xl border-gray-200 hover:border-[#429CA8] focus:border-[#429CA8]"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />}
            placeholder="••••••••"
            className="h-12 rounded-xl border-gray-200 hover:border-[#429CA8] focus:border-[#429CA8]"
          />
        </Form.Item>
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Password</span>
          <Link to="/forgot-password" title="Forgot password?" className="text-xs font-medium text-[#429CA8] hover:text-[#367d87]">
            Forgot password?
          </Link>
        </div>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="text-gray-500 text-sm">Remember me for 30 days</Checkbox>
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 bg-[#429CA8] hover:bg-[#367d87] rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-none shadow-lg shadow-[#429CA8]/20 mt-2"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}
