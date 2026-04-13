import { CloseIcon } from '@/components/reuseable/btn-icon';
import { FromInput } from '@/components/reuseable/form-input';
import Form from '@/components/reuseable/from';
import {passwordUpdateSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { Button } from '@/components/ui';
import FavIcon from '@/icon/favIcon';
import { toast } from 'sonner';

export default function UpdatePassword({ setIsUpdatePassword}:any) {
    const from2 = useForm({
        resolver: zodResolver(passwordUpdateSchema),
        defaultValues: {
          current_password: "",
          new_password: "",
          c_password: "",
        },
      });
    
      const handlePasswordSubmit = async (values: FieldValues) => {
        console.log(values);
        toast.success("Update Successful", {
          description: "Your profile has been updated successfully",
        });
      };
  return (
    <div>
          <ul className="flex items-center justify-between">
            <li className="opacity-0">0</li>
            <li className="text-2xl font-semibold">Update Password</li>
            <li>
              <CloseIcon
                className="static"
                onClose={() => {
                  from2.reset();
                  setIsUpdatePassword(false);
                }}
              />
            </li>
          </ul>
          <Form from={from2} onSubmit={handlePasswordSubmit}>
            <div className="space-y-6 pt-5">
              <FromInput
                label="Current Password"
                name="current_password"
                placeholder="Enter current password"
                className="h-10"
                icon={
                  <FavIcon name="password" className="size-5" color="#777777" />
                }
                eye={true}
              />
              <FromInput
                label="New Password"
                name="new_password"
                placeholder="Enter new password"
                className="h-10"
                icon={
                  <FavIcon name="password" className="size-5" color="#777777" />
                }
                eye={true}
              />
              <FromInput
                label="Confirm password*"
                name="c_password"
                placeholder="Enter confirm password"
                className="h-10"
                icon={
                  <FavIcon name="password" className="size-5" color="#777777" />
                }
                eye={true}
              />
              <div className="space-y-2">
                <Button className="w-full">
                  Save Changes
                </Button>
              </div>
            </div>
          </Form>
    </div>
  )
}
