"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Building2, CalendarIcon, Check, FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { MainNav } from "~~/components/main-nav";
import { Button } from "~~/components/ui/shadcn/button";
import { Calendar } from "~~/components/ui/shadcn/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Input } from "~~/components/ui/shadcn/input";
import { Label } from "~~/components/ui/shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "~~/components/ui/shadcn/popover";
import { RadioGroup, RadioGroupItem } from "~~/components/ui/shadcn/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select";
import { Separator } from "~~/components/ui/shadcn/separator";
import { cn } from "~~/lib/shadcn/utils";
import { createClient } from "~~/utils/supabase/client";

type FileWithPreview = {
  file: File;
  preview: string;
};

export default function KYCPage() {
  const router = useRouter();
  const { address } = useAccount();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Personal info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [investorType, setInvestorType] = useState("individual");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zip, setZip] = useState("");

  // Document state
  const [docType, setDocType] = useState("passport");
  const [frontDoc, setFrontDoc] = useState<FileWithPreview | null>(null);
  const [backDoc, setBackDoc] = useState<FileWithPreview | null>(null);
  const [proofDoc, setProofDoc] = useState<FileWithPreview | null>(null);

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const proofRef = useRef<HTMLInputElement>(null);

  const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegex = /^[0-9+\-\s()]+$/;

  const sanitizeName = (value: string) => {
    return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  };
  const sanitizePhone = (value: string) => {
    return value.replace(/[^0-9+\-\s()]/g, "");
  };

  const isFirstNameValid = firstName.trim().length >= 2 && onlyLettersRegex.test(firstName.trim());
  const isLastNameValid = lastName.trim().length >= 2 && onlyLettersRegex.test(lastName.trim());
  const isEmailValid = emailRegex.test(email.trim());
  const isPhoneValid = phone.trim().length >= 7 && phoneRegex.test(phone.trim());
  const isDobValid = !!dob;
  const isCitizenshipValid = citizenship.trim() !== "";
  const isStreetValid = street.trim().length >= 3;
  const isCityValid = city.trim().length >= 2;
  const isStateValid = stateProvince.trim().length >= 2;
  const isZipValid = zip.trim().length >= 3;

  const isStep0Valid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isDobValid &&
    isCitizenshipValid &&
    isStreetValid &&
    isCityValid &&
    isStateValid &&
    isZipValid;

  const isStep1Valid = !!frontDoc && !!backDoc && !!proofDoc;

  const isEntireFormValid = isStep0Valid && isStep1Valid;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: FileWithPreview | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are supported");
      return;
    }
    setter({ file, preview: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const removeFile = (setter: (val: FileWithPreview | null) => void) => {
    setter(null);
  };

  const uploadFile = async (fileData: FileWithPreview, path: string) => {
    const ext = fileData.file.name.split(".").pop();
    const filePath = `${path}.${ext}`;
    const walletLower = address?.toLowerCase() || "";

    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const headers = new Headers(init?.headers);
      headers.set("x-wallet-address", walletLower);
      return originalFetch(input, { ...init, headers });
    };

    try {
      const { error } = await supabase.storage.from("kyc-documents").upload(filePath, fileData.file, {
        upsert: true,
      });
      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
      return filePath;
    } finally {
      // Restauramos el fetch original inmediatamente para no romper otras peticiones
      window.fetch = originalFetch;
    }
  };

  const handleSubmit = async () => {
    if (!isEntireFormValid) {
      toast.error("Please complete all required fields correctly");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsSubmitting(true);

    try {
      // 🌟 REGLA DE ORO: Capturamos y congelamos la wallet al inicio exacto.
      // Nada fuera de esta constante puede cambiar durante la ejecución.
      const currentWallet = address.toLowerCase();

      let frontPath = null;
      let backPath = null;
      let proofPath = null;

      // 1. Subida de archivos al Storage usando estrictamente la wallet congelada
      if (frontDoc) {
        frontPath = await uploadFile(frontDoc, `${currentWallet}/id_front`);
      }
      if (backDoc) {
        backPath = await uploadFile(backDoc, `${currentWallet}/id_back`);
      }
      if (proofDoc) {
        proofPath = await uploadFile(proofDoc, `${currentWallet}/proof_address`);
      }

      // 2. Guardar los datos en kyc_submissions
      const { error: kycError } = await supabase
        .from("kyc_submissions")
        .upsert(
          {
            wallet_address: currentWallet, // 👈 Forzado a la wallet congelada
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            date_of_birth: dob || null,
            investor_type: investorType,
            street_address: street.trim(),
            apt_suite: apt.trim(),
            city: city.trim(),
            state_province: stateProvince.trim(),
            zip_code: zip.trim(),
            document_type: docType,
            front_doc_path: frontPath,
            back_doc_path: backPath,
            proof_address_path: proofPath,
          },
          {
            onConflict: "wallet_address",
          },
        )
        .setHeader("x-wallet-address", currentWallet);

      if (kycError) {
        throw new Error(`KYC Submission failed: ${kycError.message}`);
      }

      // 3. Actualizar el estado en la tabla profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          status: "pending",
        })
        .eq("wallet_address", currentWallet)
        .setHeader("x-wallet-address", currentWallet); // 👈 Forzado a la wallet congelada

      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`);
      }
      toast.success("¡KYC enviado con éxito!");
      router.push("/");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const citizenshipLabels: Record<string, string> = {
    us: "United States",
    ca: "Canada",
    uk: "United Kingdom",
    au: "Australia",
    other: "Other",
  };

  const steps = ["Personal Information", "Document Verification", "Review & Submit"];

  const FileUploadArea = ({
    label,
    description,
    fileState,
    inputRef,
    onFileChange,
    onRemove,
  }: {
    label: string;
    description?: string;
    fileState: FileWithPreview | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={onFileChange}
      />
      {fileState ? (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {fileState.file.type.startsWith("image/") ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fileState.preview} alt="preview" className="h-12 w-12 rounded object-cover" />
              </>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{fileState.file.name}</p>
              <p className="text-xs text-muted-foreground">{(fileState.file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files?.[0];
            if (file && inputRef.current) {
              const dt = new DataTransfer();
              dt.items.add(file);
              inputRef.current.files = dt.files;
              inputRef.current.dispatchEvent(
                new Event("change", {
                  bubbles: true,
                }),
              );
            }
          }}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Drag and drop your file here or click to browse</p>
          <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container max-w-3xl py-8 md:py-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Identity Verification</h1>
            <p className="text-muted-foreground">
              Complete your KYC verification to start investing in real estate projects.
            </p>
          </div>
          {/* Step Indicator */}
          <div className="mt-8 mb-6">
            <div className="flex items-center gap-2">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      i < currentStep
                        ? "bg-primary text-primary-foreground"
                        : i === currentStep
                          ? "border-2 border-primary text-primary"
                          : "border border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-sm hidden sm:inline ${
                      i === currentStep ? "font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                  {i < steps.length - 1 && <Separator className="flex-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 0 */}
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Please provide your personal details for verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name"> First Name </Label>
                    <Input
                      id="first-name"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={e => setFirstName(sanitizeName(e.target.value))}
                    />
                    {firstName && !isFirstNameValid && (
                      <p className="text-sm text-red-500">Only letters,spaces and accents are allowed</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name"> Last Name </Label>
                    <Input
                      id="last-name"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={e => setLastName(sanitizeName(e.target.value))}
                    />
                    {lastName && !isLastNameValid && (
                      <p className="text-sm text-red-500">Only letters, spaces and accents are allowed</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email"> Email Address </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {email && !isEmailValid && <p className="text-sm text-red-500">Enter a valid email address </p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone"> Phone Number </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={e => setPhone(sanitizePhone(e.target.value))}
                  />
                  {phone && !isPhoneValid && <p className="text-sm text-red-500">Enter a valid phone number</p>}
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="dob" className="mb-1">
                    {" "}
                    Date of Birth{" "}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-10",
                          !dob && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dob ? format(new Date(dob), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dob ? new Date(`${dob}T00:00:00`) : undefined}
                        onSelect={date => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const day = String(date.getDate()).padStart(2, "0");
                            setDob(`${year}-${month}-${day}`);
                          } else {
                            setDob("");
                          }
                        }}
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date(new Date().getFullYear() - 18, 11)}
                        defaultMonth={new Date(2008, 0)}
                        disabled={date => {
                          const limitDate = new Date();
                          limitDate.setFullYear(limitDate.getFullYear() - 18);
                          return date > limitDate || date < new Date(1900, 0, 1);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label> Citizenship </Label>
                  <Select value={citizenship} onValueChange={setCitizenship}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your citizenship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label> Investor Type </Label>
                  <RadioGroup value={investorType} onValueChange={setInvestorType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual"> Individual Investor </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="entity" id="entity" />
                      <Label htmlFor="entity"> Entity (LLC, Corporation, Trust)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="Street Address"
                    className="mb-2"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                  />
                  <Input
                    placeholder="Apt, Suite, Unit (optional)"
                    className="mb-2"
                    value={apt}
                    onChange={e => setApt(e.target.value)}
                  />
                  <div className="grid gap-2 md:grid-cols-3">
                    <Input placeholder="City" value={city} onChange={e => setCity(sanitizeName(e.target.value))} />
                    <Input
                      placeholder="State/Province"
                      value={stateProvince}
                      onChange={e => setStateProvince(sanitizeName(e.target.value))}
                    />
                    <Input
                      placeholder="Zip/Postal Code"
                      value={zip}
                      onChange={e => setZip(e.target.value.replace(/[^0-9A-Za-z-\s]/g, ""))}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button onClick={() => setCurrentStep(1)} disabled={!isStep0Valid}>
                  Continue to Documents
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 1 */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>Please upload the required documents to verify your identity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Identification Document</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers-license">Driver&apos;s License</SelectItem>
                      <SelectItem value="id-card">Government ID Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FileUploadArea
                  label="Upload Front Side"
                  fileState={frontDoc}
                  inputRef={frontRef}
                  onFileChange={e => handleFileSelect(e, setFrontDoc)}
                  onRemove={() => removeFile(setFrontDoc)}
                />
                <FileUploadArea
                  label="Upload Back Side"
                  fileState={backDoc}
                  inputRef={backRef}
                  onFileChange={e => handleFileSelect(e, setBackDoc)}
                  onRemove={() => removeFile(setBackDoc)}
                />
                <Separator />

                <FileUploadArea
                  label="Proof of Address"
                  description="Please upload a document showing your current address (utility bill, bank statement, etc.) issued within the last 3 months."
                  fileState={proofDoc}
                  inputRef={proofRef}
                  onFileChange={e => handleFileSelect(e, setProofDoc)}
                  onRemove={() => removeFile(setProofDoc)}
                />
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  {" "}
                  Back{" "}
                </Button>
                <Button onClick={() => setCurrentStep(2)} disabled={!isStep1Valid}>
                  Continue to Review
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Review &amp; Submit</CardTitle>
                <CardDescription>Please review your information before submitting for verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">
                        {firstName} {lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{dob || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Citizenship</p>
                      <p className="font-medium">{citizenshipLabels[citizenship] || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Investor Type</p>
                      <p className="font-medium">{investorType === "individual" ? "Individual Investor" : "Entity"}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Address</h3>
                  <p className="font-medium">{street || "—"}</p>
                  {apt && <p className="font-medium">{apt}</p>}
                  <p className="font-medium">{[city, stateProvince, zip].filter(Boolean).join(", ") || "—"}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: `${docType === "passport" ? "Passport" : docType === "drivers-license" ? "Driver's License" : "ID Card"} - Front`,
                        file: frontDoc,
                      },
                      {
                        label: `${docType === "passport" ? "Passport" : docType === "drivers-license" ? "Driver's License" : "ID Card"} - Back`,
                        file: backDoc,
                      },
                      { label: "Proof of Address", file: proofDoc },
                    ].map(doc => (
                      <div key={doc.label} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.label}</p>
                            <p className="text-sm text-muted-foreground">{doc.file?.file.name || "Not uploaded"}</p>
                          </div>
                        </div>
                        {doc.file ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-sm text-destructive">Missing</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Verification Process</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your information will be reviewed by our compliance team. This process typically takes 1-2
                        business days. You will receive an email notification once your verification is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>

                <Button onClick={handleSubmit} disabled={isSubmitting || !isEntireFormValid}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Verification
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />

            <span className="text-lg font-semibold">RealFund</span>
          </div>

          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} RealFund. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>

            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>

            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
