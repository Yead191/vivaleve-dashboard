import React from 'react';
import { Form, Input, Button, } from 'antd';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Forgot password values:', values);
    toast.success('Verification code sent to your email!');
    navigate('/verify-otp');
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you a 4-digit verification code"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-6"
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

        <Form.Item className="mb-0 pt-2">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 bg-[#429CA8] hover:bg-[#367d87] rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-none shadow-lg shadow-[#429CA8]/20"
          >
            Send Reset Code
            <ArrowRight className="w-4 h-4" />
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
