
import { Form, Button, Input } from 'antd';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { toast } from 'sonner';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('OTP values:', values);
    toast.success('OTP verified successfully!');
    navigate('/reset-password');
  };

  const resendOtp = () => {
    toast.info('New OTP sent to your email');
  };

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="We've sent a 4-digit code to your email. Please enter it below to continue."
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-8"
      >
        <Form.Item
          name="otp"
          rules={[{ required: true, message: 'Please enter the code' }]}
          className="flex justify-center"
        >
          <Input.OTP
            length={4}
            formatter={(str) => str.toUpperCase()}
            className="otp-input"
            style={{
              height: '64px',
              width: '100%',
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}
          />
        </Form.Item>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={resendOtp}
            className="text-sm font-semibold text-[#429CA8] hover:text-[#367d87] flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resend Code
          </button>
        </div>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 bg-[#429CA8] hover:bg-[#367d87] rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-none shadow-lg shadow-[#429CA8]/20"
          >
            Verify & Proceed
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

      <style dangerouslySetInnerHTML={{ __html: `
        .otp-input .ant-input {
          width: 64px !important;
          height: 64px !important;
          border-radius: 16px !important;
          font-size: 24px !important;
          font-weight: 700 !important;
          color: #111827 !important;
          border-color: #f3f4f6 !important;
          background: #f9fafb !important;
          text-align: center !important;
        }
        .otp-input .ant-input:hover, .otp-input .ant-input:focus {
          border-color: #429CA8 !important;
          background: white !important;
          box-shadow: 0 0 0 4px rgba(66, 156, 168, 0.1) !important;
        }
      `}} />
    </AuthLayout>
  );
}
