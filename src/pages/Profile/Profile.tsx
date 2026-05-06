import React, { useState } from 'react';
import { App, Button, Form, Input, Card, Tabs, Upload, Avatar, Tag, Divider } from 'antd';
import {
  User,
  Mail,
  Lock,
  Shield,
  Camera,
  Globe,
  Phone,
  CheckCircle2,
  Bell,
  Save,
  LogOut
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

export default function Profile() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleUpdateProfile = (values: any) => {
    console.log('Profile update:', values);
    message.success('Profile updated successfully');
  };

  const handleChangePassword = (values: any) => {
    console.log('Password change:', values);
    message.success('Password changed successfully');
    passwordForm.resetFields();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your account settings and security preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Brief Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-gray-200 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-brand-400 to-brand-600 -mx-6 -mt-6" />
            <div className="relative flex flex-col items-center -mt-12 mb-4">
              <div className="relative group">
                <Avatar
                  size={100}
                  className="border-4 border-white shadow-md bg-white text-3xl font-bold"
                  style={{ backgroundColor: '#429CA8' }}
                >
                  AD
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:text-brand-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Aria Dey</h2>
              <p className="text-gray-500 text-sm">Super Administrator</p>
              <div className="mt-2 flex">
                <Tag
                  color="cyan"
                  icon={<Shield className="w-3 h-3" />}
                  className="flex items-center gap-1"
                >
                  Verified Admin
                </Tag>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>aria.dey@vivaleve.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-gray-400" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                <span>Active since Jan 2024</span>
              </div>
            </div>

            <div className="mt-8">
              <Button danger block icon={<LogOut className="w-4 h-4" />} className="flex items-center justify-center">
                Sign Out
              </Button>
            </div>
          </Card>

          {/* <Card title="Activity Summary" className="shadow-sm border-gray-200">
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1">Moderation Actions</div>
                <div className="text-lg font-bold text-gray-900">1,248</div>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1">Reports Resolved</div>
                <div className="text-lg font-bold text-gray-900">842</div>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1">System Changes</div>
                <div className="text-lg font-bold text-gray-900">56</div>
              </div>
            </div>
          </Card> */}
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-gray-200 min-h-[600px]">
            <Tabs defaultActiveKey="1" items={[
              {
                key: '1',
                label: (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    General Information
                  </span>
                ),
                children: (
                  <div className="pt-4">
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{
                        name: 'Aria Dey',
                        email: 'aria.dey@vivaleve.com',
                        phone: '+1 (555) 123-4567',
                        bio: 'Super administrator responsible for high-level system configurations and security audits.'
                      }}
                      onFinish={handleUpdateProfile}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                          <Input prefix={<User className="w-4 h-4 text-gray-400 mr-2" />} />
                        </Form.Item>
                        <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                          <Input prefix={<Mail className="w-4 h-4 text-gray-400 mr-2" />} />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone Number">
                          <Input prefix={<Phone className="w-4 h-4 text-gray-400 mr-2" />} />
                        </Form.Item>
                        <Form.Item name="location" label="Location">
                          <Input prefix={<Globe className="w-4 h-4 text-gray-400 mr-2" />} placeholder="e.g. London, UK" />
                        </Form.Item>
                      </div>
                      <Form.Item name="bio" label="About Me">
                        <Input.TextArea rows={4} placeholder="Brief description about your role..." />
                      </Form.Item>
                      <div className="flex justify-end pt-4">
                        <Button type="primary" htmlType="submit" icon={<Save className="w-4 h-4" />} size="large">
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  </div>
                ),
              },
              {
                key: '2',
                label: (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Security & Password
                  </span>
                ),
                children: (
                  <div className="pt-4">
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6 flex gap-3">
                      <Shield className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-900">Strong Password Policy</h4>
                        <p className="text-xs text-amber-700 mt-1">
                          Ensure your password is at least 12 characters long, contains a mix of uppercase, lowercase, numbers, and special symbols.
                        </p>
                      </div>
                    </div>

                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handleChangePassword}
                    >
                      <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[{ required: true }]}
                      >
                        <Input.Password prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />} />
                      </Form.Item>

                      <Divider />

                      <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[{ required: true, min: 12 }]}
                      >
                        <Input.Password prefix={<Shield className="w-4 h-4 text-gray-400 mr-2" />} />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        dependencies={['newPassword']}
                        rules={[
                          { required: true },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The two passwords do not match!'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password prefix={<Shield className="w-4 h-4 text-gray-400 mr-2" />} />
                      </Form.Item>

                      <div className="flex justify-end pt-4">
                        <Button type="primary" htmlType="submit" size="large">
                          Update Password
                        </Button>
                      </div>
                    </Form>
                  </div>
                ),
              },
              {
                key: '3',
                label: (
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </span>
                ),
                children: (
                  <div className="pt-4 space-y-6">
                    <NotificationSetting
                      title="New user reports"
                      desc="Receive a notification when a new user is reported for violations."
                      defaultChecked
                    />
                    <NotificationSetting
                      title="System alerts"
                      desc="Get notified about server performance, errors, and scheduled maintenance."
                      defaultChecked
                    />
                    <NotificationSetting
                      title="Financial milestones"
                      desc="Daily revenue summaries and high-value transaction alerts."
                    />
                    <NotificationSetting
                      title="Direct messages"
                      desc="Receive notifications for internal admin-to-admin messages."
                      defaultChecked
                    />
                  </div>
                )
              }
            ]} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function NotificationSetting({ title, desc, defaultChecked = false }: { title: string, desc: string, defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="pr-4">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <div className="shrink-0">
        <input type="checkbox" defaultChecked={defaultChecked} className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500" />
      </div>
    </div>
  );
}
