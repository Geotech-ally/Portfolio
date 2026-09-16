import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentProps<typeof Link> & Pick<ButtonProps, "variant" | "size">;

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
