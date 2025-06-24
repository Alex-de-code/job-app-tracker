const Settings = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation sidebar */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-bold mb-4">Settings</h2>
          <nav>
            <Link
              href="/settings/goals"
              className="block py-2 font-medium text-blue-600"
            >
              Application Goals
            </Link>
            <Link
              href="/settings/notifications"
              className="block py-2 text-gray-600"
            >
              Notifications
            </Link>
          </nav>
        </div>

        {/* Content area */}
        <div className="md:col-span-2">
          <Route path="/settings/goals" component={GoalSettings} />
          <Route
            path="/settings/notifications"
            component={NotificationSettings}
          />
        </div>
      </div>
    </>
  );
};

export default Settings;
