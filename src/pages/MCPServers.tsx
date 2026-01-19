import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Code, Terminal, Globe, FolderOpen, GitBranch, ShieldCheck, Gear } from "@phosphor-icons/react"

interface Tool {
  name: string
  description: string
}

interface MCPServer {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  tools: Tool[]
}

const mcpServers: MCPServer[] = [
  {
    id: "github",
    name: "GitHub MCP Server",
    description: "Provides comprehensive access to GitHub repositories, pull requests, issues, workflows, and more",
    icon: <GitBranch size={24} className="text-primary" />,
    tools: [
      { name: "github-mcp-server-actions_get", description: "Get details about specific GitHub Actions resources (workflows, runs, jobs, artifacts)" },
      { name: "github-mcp-server-actions_list", description: "List GitHub Actions resources (workflows, runs, jobs, artifacts)" },
      { name: "github-mcp-server-get_code_scanning_alert", description: "Get details of a specific code scanning alert" },
      { name: "github-mcp-server-get_commit", description: "Get details for a commit from a GitHub repository" },
      { name: "github-mcp-server-get_file_contents", description: "Get the contents of a file or directory from a GitHub repository" },
      { name: "github-mcp-server-get_job_logs", description: "Get logs for GitHub Actions workflow jobs" },
      { name: "github-mcp-server-get_label", description: "Get a specific label from a repository" },
      { name: "github-mcp-server-get_latest_release", description: "Get the latest release in a GitHub repository" },
      { name: "github-mcp-server-get_release_by_tag", description: "Get a specific release by its tag name" },
      { name: "github-mcp-server-get_secret_scanning_alert", description: "Get details of a specific secret scanning alert" },
      { name: "github-mcp-server-get_tag", description: "Get details about a specific git tag" },
      { name: "github-mcp-server-issue_read", description: "Get information about a specific issue in a GitHub repository" },
      { name: "github-mcp-server-list_branches", description: "List branches in a GitHub repository" },
      { name: "github-mcp-server-list_code_scanning_alerts", description: "List code scanning alerts in a GitHub repository" },
      { name: "github-mcp-server-list_commits", description: "Get list of commits of a branch in a GitHub repository" },
      { name: "github-mcp-server-list_issue_types", description: "List supported issue types for repository owner (organization)" },
      { name: "github-mcp-server-list_issues", description: "List issues in a GitHub repository" },
      { name: "github-mcp-server-list_pull_requests", description: "List pull requests in a GitHub repository" },
      { name: "github-mcp-server-list_releases", description: "List releases in a GitHub repository" },
      { name: "github-mcp-server-list_secret_scanning_alerts", description: "List secret scanning alerts in a GitHub repository" },
      { name: "github-mcp-server-list_tags", description: "List git tags in a GitHub repository" },
      { name: "github-mcp-server-pull_request_read", description: "Get information on a specific pull request" },
      { name: "github-mcp-server-search_code", description: "Fast and precise code search across ALL GitHub repositories" },
      { name: "github-mcp-server-search_issues", description: "Search for issues in GitHub repositories" },
      { name: "github-mcp-server-search_pull_requests", description: "Search for pull requests in GitHub repositories" },
      { name: "github-mcp-server-search_repositories", description: "Find GitHub repositories by name, description, topics, or metadata" },
      { name: "github-mcp-server-search_users", description: "Find GitHub users by username, real name, or profile information" }
    ]
  },
  {
    id: "playwright",
    name: "Playwright Browser Automation",
    description: "Browser automation tools for web testing and interaction",
    icon: <Globe size={24} className="text-primary" />,
    tools: [
      { name: "playwright-browser_close", description: "Close the browser page" },
      { name: "playwright-browser_resize", description: "Resize the browser window" },
      { name: "playwright-browser_console_messages", description: "Returns all console messages" },
      { name: "playwright-browser_handle_dialog", description: "Handle a dialog (accept/dismiss)" },
      { name: "playwright-browser_evaluate", description: "Evaluate JavaScript expression on page or element" },
      { name: "playwright-browser_file_upload", description: "Upload one or multiple files" },
      { name: "playwright-browser_fill_form", description: "Fill multiple form fields" },
      { name: "playwright-browser_install", description: "Install the browser specified in the config" },
      { name: "playwright-browser_press_key", description: "Press a key on the keyboard" },
      { name: "playwright-browser_type", description: "Type text into editable element" },
      { name: "playwright-browser_navigate", description: "Navigate to a URL" },
      { name: "playwright-browser_navigate_back", description: "Go back to the previous page" },
      { name: "playwright-browser_network_requests", description: "Returns all network requests since loading the page" },
      { name: "playwright-browser_take_screenshot", description: "Take a screenshot of the current page" },
      { name: "playwright-browser_snapshot", description: "Capture accessibility snapshot of the current page" },
      { name: "playwright-browser_click", description: "Perform click on a web page" },
      { name: "playwright-browser_drag", description: "Perform drag and drop between two elements" },
      { name: "playwright-browser_hover", description: "Hover over element on page" },
      { name: "playwright-browser_select_option", description: "Select an option in a dropdown" },
      { name: "playwright-browser_tabs", description: "List, create, close, or select a browser tab" },
      { name: "playwright-browser_wait_for", description: "Wait for text to appear or disappear or a specified time to pass" }
    ]
  },
  {
    id: "web",
    name: "Web Tools",
    description: "Tools for searching and fetching content from the web",
    icon: <Globe size={24} className="text-primary" />,
    tools: [
      { name: "web_search", description: "AI-powered web search to provide intelligent, contextual answers with citations" },
      { name: "web_fetch", description: "Fetch a URL and return the page as markdown or raw HTML" }
    ]
  },
  {
    id: "bash",
    name: "Shell Command Tools",
    description: "Execute and manage shell commands in interactive Bash sessions",
    icon: <Terminal size={24} className="text-primary" />,
    tools: [
      { name: "bash", description: "Run a Bash command in an interactive Bash session" },
      { name: "write_bash", description: "Send input to a running Bash command or session" },
      { name: "read_bash", description: "Read output from a Bash command running in an async session" },
      { name: "stop_bash", description: "Stop a running Bash command by terminating the session" },
      { name: "list_bash", description: "List all active Bash sessions with their status" }
    ]
  },
  {
    id: "filesystem",
    name: "File System Tools",
    description: "Tools for viewing, creating, editing, and searching files and directories",
    icon: <FolderOpen size={24} className="text-primary" />,
    tools: [
      { name: "view", description: "View files and directories with syntax highlighting" },
      { name: "create", description: "Create new files with specified content" },
      { name: "edit", description: "Make string replacements in files" },
      { name: "grep", description: "Fast and precise code search using ripgrep" },
      { name: "glob", description: "Fast file pattern matching using glob patterns" }
    ]
  },
  {
    id: "code-quality",
    name: "Code Quality & Security",
    description: "Tools for code review, security scanning, and vulnerability detection",
    icon: <ShieldCheck size={24} className="text-primary" />,
    tools: [
      { name: "code_review", description: "Request an automated code review for the current PR changes" },
      { name: "codeql_checker", description: "Discover security vulnerabilities in code using CodeQL" },
      { name: "gh-advisory-database", description: "Check the GitHub advisory DB for vulnerabilities in dependencies" },
      { name: "store_memory", description: "Store facts about the codebase for future use" }
    ]
  },
  {
    id: "workflow",
    name: "Workflow Tools",
    description: "Tools for managing development workflow and progress",
    icon: <Gear size={24} className="text-primary" />,
    tools: [
      { name: "report_progress", description: "Report progress on the task, commit changes, and update PR" },
      { name: "task", description: "Launch specialized agents in separate context windows for specific tasks" }
    ]
  }
]

export function MCPServers() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">MCP Servers</h1>
          <p className="text-muted-foreground">
            Model Context Protocol (MCP) servers provide tools and capabilities for AI assistants. 
            Below is a list of all currently available MCP servers and the tools they expose.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {mcpServers.map((server) => (
            <Card key={server.id} className="p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {server.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1">{server.name}</h2>
                  <p className="text-sm text-muted-foreground">{server.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {server.tools.length} tools
                  </Badge>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tools" className="border-none">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                    View All Tools
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {server.tools.map((tool, index) => (
                        <div 
                          key={index} 
                          className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <Code size={16} className="text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-mono font-semibold text-primary break-all">
                                {tool.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-sm font-semibold mb-2">About MCP Servers</h3>
          <p className="text-xs text-muted-foreground">
            MCP (Model Context Protocol) is a standardized protocol that allows AI assistants to interact with external tools and services. 
            Each MCP server provides a set of tools that extend the capabilities of the AI assistant. 
            These tools can range from file system operations to GitHub integrations, web browsing, and security scanning.
          </p>
        </div>
      </div>
    </div>
  )
}
