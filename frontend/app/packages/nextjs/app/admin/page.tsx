"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Building2, Check, Loader2, Shield, X } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { HeaderAdmin } from "~~/components/admin/HeaderAdmin";
import { MoreKycInfoDialog } from "~~/components/admin/MoreKycInfoDialog";
import { Address } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/shadcn/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/shadcn/tabs";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { IKycPending } from "~~/types/interfaces";
import { createClient } from "~~/utils/supabase/client";

// Sample data
// const recentUsers = [
//   {
//     id: "U-5023",
//     name: "Thomas Anderson",
//     email: "t.anderson@example.com",
//     joined: "May 12, 2023",
//     kycStatus: "Verified",
//     investments: "$5,000",
//   },
//   {
//     id: "U-5022",
//     name: "Lisa Campbell",
//     email: "l.campbell@example.com",
//     joined: "May 12, 2023",
//     kycStatus: "Pending",
//     investments: "$0",
//   },
//   {
//     id: "U-5021",
//     name: "Robert Kim",
//     email: "r.kim@example.com",
//     joined: "May 11, 2023",
//     kycStatus: "Verified",
//     investments: "$10,000",
//   },
//   {
//     id: "U-5020",
//     name: "Jennifer Lopez",
//     email: "j.lopez@example.com",
//     joined: "May 11, 2023",
//     kycStatus: "Pending",
//     investments: "$0",
//   },
//   {
//     id: "U-5019",
//     name: "William Smith",
//     email: "w.smith@example.com",
//     joined: "May 10, 2023",
//     kycStatus: "Verified",
//     investments: "$2,500",
//   },
// ];

// const activeProjects = [
//   {
//     id: "P-1005",
//     name: "Oakridge Apartments",
//     type: "Multifamily",
//     location: "Austin, TX",
//     fundingGoal: 5000000,
//     progress: 75,
//     status: "Active",
//   },
//   {
//     id: "P-1004",
//     name: "Riverside Commercial Center",
//     type: "Commercial",
//     location: "Chicago, IL",
//     fundingGoal: 8000000,
//     progress: 45,
//     status: "Active",
//   },
//   {
//     id: "P-1003",
//     name: "Sunset Heights Development",
//     type: "Development",
//     location: "Miami, FL",
//     fundingGoal: 12000000,
//     progress: 60,
//     status: "Active",
//   },
//   {
//     id: "P-1002",
//     name: "Mountain View Retail Plaza",
//     type: "Retail",
//     location: "Denver, CO",
//     fundingGoal: 3500000,
//     progress: 100,
//     status: "Active",
//   },
//   {
//     id: "P-1001",
//     name: "Harbor Point Office Tower",
//     type: "Office",
//     location: "Seattle, WA",
//     fundingGoal: 15000000,
//     progress: 30,
//     status: "Active",
//   },
// ];

// const recentActivity = [
//   {
//     type: "alert",
//     title: "KYC Verification Backlog",
//     description: "There are 18 pending KYC verifications that need review.",
//     time: "10 minutes ago",
//     action: "Review",
//   },
//   {
//     type: "success",
//     title: "Project Fully Funded",
//     description: "Mountain View Retail Plaza has reached 100% of its funding goal.",
//     time: "1 hour ago",
//     action: "View",
//   },
//   {
//     type: "info",
//     title: "New Project Submission",
//     description: "A new project 'Lakeside Residences' has been submitted for review.",
//     time: "2 hours ago",
//     action: "Review",
//   },
//   {
//     type: "info",
//     title: "Large Investment",
//     description: "User Robert Kim has invested $10,000 in Riverside Commercial Center.",
//     time: "3 hours ago",
//     action: "View",
//   },
//   {
//     type: "success",
//     title: "Distribution Completed",
//     description: "Quarterly distribution for Oakridge Apartments has been processed.",
//     time: "5 hours ago",
//     action: "Details",
//   },
// ];

export default function AdminPage() {
  const { address } = useAccount();
  const supabase = createClient();

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
    contractName: "AsteraIdentityRegistry",
  });

  const [submissions, setSubmissions] = useState<IKycPending[]>([]);
  const [loading, setLoading] = useState(true);

  //functions
  const fetchAllSubmissions = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);
      const adminWalletLower = address.toLowerCase();

      const { data, error } = await supabase
        .from("kyc_submissions")
        .select(
          `
        *,
        profiles (
          status
        )
      `,
        )
        .order("id", { ascending: false })
        .setHeader("x-wallet-address", adminWalletLower);

      if (error) {
        console.error("Error fetching submissions:", error.message);
        return;
      }

      if (data) {
        setSubmissions(data as unknown as IKycPending[]);
      }
    } catch (err) {
      console.error("Exception in fetchAllSubmissions:", err);
    } finally {
      setLoading(false);
    }
  }, [address, supabase]);

  useEffect(() => {
    fetchAllSubmissions();
  }, [fetchAllSubmissions]);

  const handleApprove = async (submissionId: string, walletAddress: string) => {
    if (!address || !walletAddress) return;

    try {
      await writeYourContractAsync({
        functionName: "registerUser",
        args: [walletAddress],
      });
    } catch (error: any) {
      console.error("Error al aprobar KYC:", error);
      toast.error(`Error al aprobar el KYC: ${error.message}`);
      return;
    }

    try {
      const adminWalletLower = address.toLowerCase();
      const userWalletLower = walletAddress.toLowerCase();

      const { error } = await supabase
        .from("profiles")
        .update({
          status: "approved",
          kyc_completed: true,
        })
        .eq("wallet_address", userWalletLower)
        .setHeader("x-wallet-address", adminWalletLower);

      if (error) throw error;

      toast.success("¡KYC aprobado con éxito!");

      await fetchAllSubmissions();
    } catch (err: any) {
      console.error("Error al aprobar KYC:", err);
      toast.error(`Error al aprobar el KYC: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="absolute h-10 w-10 rounded-full bg-primary/10 blur-xl"></div>
        </div>
        <p className="text-sm font-medium text-muted-foreground tracking-wide animate-pulse">
          Verificando credenciales...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Navigation */}
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <div className="border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">RealFund Admin</span>
              </div>
            </div>
            <nav className="flex-1 overflow-auto py-2">
              <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Dashboard</h2>
                <div className="space-y-1">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
                  >
                    <Home className="h-4 w-4" />
                    Overview
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Users className="h-4 w-4" />
                    Users
                  </Link>
                  <Link
                    href="/admin/projects"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Building2 className="h-4 w-4" />
                    Projects
                  </Link>
                  <Link
                    href="/admin/transactions"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <CreditCard className="h-4 w-4" />
                    Transactions
                  </Link>
                  <Link
                    href="/admin/kyc"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Shield className="h-4 w-4" />
                    KYC Approvals
                  </Link>
                </div>
              </div>
              <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Settings</h2>
                <div className="space-y-1">
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Platform Settings
                  </Link>
                  <Link
                    href="/admin/help"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </Link>
                </div>
              </div>
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Admin avatar" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@realfund.com</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet> */}

      {/* Desktop Sidebar */}
      {/* <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">RealFund Admin</span>
            </div>
          </div>
          <nav className="flex-1 overflow-auto py-6">
            <div className="px-4 py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Dashboard</h2>
              <div className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
                >
                  <Home className="h-4 w-4" />
                  Overview
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Users className="h-4 w-4" />
                  Users
                </Link>
                <Link
                  href="/admin/projects"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Building2 className="h-4 w-4" />
                  Projects
                </Link>
                <Link
                  href="/admin/transactions"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <CreditCard className="h-4 w-4" />
                  Transactions
                </Link>
                <Link
                  href="/admin/kyc"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Shield className="h-4 w-4" />
                  KYC Approvals
                </Link>
              </div>
            </div>
            <div className="px-4 py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Settings</h2>
              <div className="space-y-1">
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Platform Settings
                </Link>
                <Link
                  href="/admin/help"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Link>
              </div>
            </div>
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src="/placeholder.svg?height=40&width=40" alt="Admin avatar" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@realfund.com</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1">
        <HeaderAdmin />

        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button>Add New Project</Button>
            </div>
          </div>

          {/* Dashboard Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+24 this week</p>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="flex flex-1 items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 pending approval</p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4.2M</div>
                <p className="text-xs text-muted-foreground">+$320K this month</p>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="flex flex-1 items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.length}</div>
                {/* <p className="text-xs text-muted-foreground">5 new today</p> */}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="kyc">
            <TabsList>
              <TabsTrigger className="w-full" value="kyc">
                KYC pendientes
              </TabsTrigger>
              {/* <TabsTrigger value="users">Recent Users</TabsTrigger> */}
              {/* <TabsTrigger value="projects">Active Projects</TabsTrigger> */}
            </TabsList>
            <TabsContent value="kyc" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>KYC pendientes</CardTitle>
                  <CardDescription>
                    Revisar y aprobar solicitudes de verificación de identidad de usuarios.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Wallet</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map(submission => (
                          <TableRow key={submission.id}>
                            <TableCell className="pe-6">
                              <Address
                                address={submission.wallet_address}
                                disableAddressLink
                                format="short"
                                onlyEnsOrAddress
                                size="xs"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                  <Image
                                    src="/placeholder.svg?height=32&width=32"
                                    alt={`${submission.first_name} ${submission.last_name} avatar`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span>
                                  {submission.first_name} {submission.last_name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{submission.date_of_birth}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    submission.profiles?.status === "pending"
                                      ? "bg-yellow-500"
                                      : submission.profiles?.status === "approved"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                  }`}
                                />
                                <span>{submission.profiles?.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="pl-2">
                              {submission.profiles?.status !== "approved" && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="bg-primary text-black hover:bg-primary/80 mr-2"
                                  onClick={() => handleApprove(submission.id, submission.wallet_address)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <MoreKycInfoDialog submission={submission} />
                              <Button
                                variant="outline"
                                size="icon"
                                className="bg-destructive text-white hover:bg-destructive/80"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            {/* <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Recently registered users on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>KYC Status</TableHead>
                          <TableHead>Investments</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                  <Image
                                    src="/placeholder.svg?height=32&width=32"
                                    alt={`${user.name} avatar`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span>{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.joined}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    user.kycStatus === "Verified"
                                      ? "bg-green-500"
                                      : user.kycStatus === "Pending"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                />
                                <span>{user.kycStatus}</span>
                              </div>
                            </TableCell>
                            <TableCell>{user.investments}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem>View Investments</DropdownMenuItem>
                                  <DropdownMenuItem>View Documents</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Edit User</DropdownMenuItem>
                                  <DropdownMenuItem>Suspend User</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent> */}
            {/* <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Currently active investment projects on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Funding Goal</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeProjects.map(project => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 overflow-hidden rounded">
                                  <Image
                                    src="/placeholder.svg?height=32&width=32"
                                    alt={`${project.name} thumbnail`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span>{project.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{project.type}</TableCell>
                            <TableCell>{project.location}</TableCell>
                            <TableCell>${project.fundingGoal.toLocaleString()}</TableCell>
                            <TableCell>{project.progress}%</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    project.status === "Active"
                                      ? "bg-green-500"
                                      : project.status === "Pending"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                />
                                <span>{project.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>View Investors</DropdownMenuItem>
                                  <DropdownMenuItem>View Documents</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                  <DropdownMenuItem>Pause Funding</DropdownMenuItem>
                                  <DropdownMenuItem>Close Project</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent> */}
          </Tabs>

          {/* Recent Activity */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent platform activity and notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        activity.type === "alert"
                          ? "bg-red-100"
                          : activity.type === "success"
                            ? "bg-green-100"
                            : activity.type === "info"
                              ? "bg-blue-100"
                              : "bg-muted"
                      }`}
                    >
                      {activity.type === "alert" ? (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      ) : activity.type === "success" ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : activity.type === "info" ? (
                        <Bell className="h-5 w-5 text-blue-600" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.action && (
                      <Button variant="outline" size="sm">
                        {activity.action}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </main>
      </div>
    </div>
  );
}
