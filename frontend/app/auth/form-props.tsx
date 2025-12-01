
export interface RegisterFormProps {
  isActive: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: string[];
}

export interface LoginFormProps {
  isActive: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: string[];
}