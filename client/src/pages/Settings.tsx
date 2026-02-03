import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Settings() {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <AppLayout>
      <div className="h-full overflow-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your workspace settings and integrations.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Workspace Settings</CardTitle>
                <CardDescription>
                  Configure your workspace name and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input
                    id="workspace-name"
                    defaultValue="Bloom & Wild Finance"
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    defaultValue="Europe/London (GMT+0)"
                    className="max-w-md"
                    disabled
                  />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Connected Integrations</CardTitle>
                <CardDescription>
                  Manage your ERP, email, and other integrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      📧
                    </div>
                    <div>
                      <p className="font-medium">Gmail</p>
                      <p className="text-sm text-muted-foreground">
                        finance@bloomandwild.com
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      📊
                    </div>
                    <div>
                      <p className="font-medium">NetSuite</p>
                      <p className="text-sm text-muted-foreground">
                        Connected • Last sync 5m ago
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Feature coming soon")}>
                  + Add Integration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about worker activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email alerts for items requiring review
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Slack notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send alerts to your Slack channel
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily digest</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of worker activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>
                  Configure security settings and compliance options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all team members
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SSO (Single Sign-On)</p>
                    <p className="text-sm text-muted-foreground">
                      Enable SAML-based SSO for your organization
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Feature coming soon")}>
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Audit log retention</p>
                    <p className="text-sm text-muted-foreground">
                      How long to keep activity logs
                    </p>
                  </div>
                  <span className="text-sm font-medium">7 years</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
