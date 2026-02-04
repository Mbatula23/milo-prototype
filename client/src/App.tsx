import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Workers from "./pages/Workers";
import WorkerDetail from "./pages/WorkerDetail";
import Inbox from "./pages/Inbox";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Members from "./pages/Members";
import NewWorker from "./pages/NewWorker";
import LegislationTracker from "./pages/LegislationTracker";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Workers} />
      <Route path="/workers" component={Workers} />
      <Route path="/workers/new" component={NewWorker} />
      <Route path="/workers/:id" component={WorkerDetail} />
      <Route path="/workers/:id/output" component={LegislationTracker} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/activity" component={Activity} />
      <Route path="/settings" component={Settings} />
      <Route path="/members" component={Members} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
