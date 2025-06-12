
// import { useEffect } from "react";
// import { Control, UseFormSetValue, useWatch } from "react-hook-form";
// import { getCityOptions, regionOptions } from "../ukraine/regions";
// import { SelectWithLabel } from "./FormFields";

// interface Props {
//   t: (key: string) => string;
 
//   control: Control<any>;
//   setValue: UseFormSetValue<any>;
// }

// export default function UkraineLocationSelects({ t, control, setValue }: Props) {
//   const selectedRegion = useWatch({ control, name: "primary_region_ukraine" });

//   useEffect(() => {
//     setValue("primary_city_ukraine", "");
//   }, [selectedRegion, setValue]);

//   return (
//     <>
//       <div className="mt-6">
//         <SelectWithLabel
//           control={control}
//           name="primary_region_ukraine"
//           label={t("insuranceForm.step2.primaryRegion")}
//           options={regionOptions}
//           placeholder="Select a region"
//         />
//       </div>

//       <div className="mt-6">
//         <SelectWithLabel
//           control={control}
//           name="primary_city_ukraine"
//           label={t("insuranceForm.step2.primaryCity")}
//           options={getCityOptions(selectedRegion)}
//           placeholder="Select a city"
//         />
//       </div>
//     </>
//   );
// }


import { useEffect } from "react";
import { Control, UseFormSetValue, useWatch, FieldValues, Path, PathValue } from "react-hook-form";
import { getCityOptions, regionOptions } from "../ukraine/regions";
import { SelectWithLabel } from "./FormFields";

interface Props<T extends FieldValues = FieldValues> {
  t: (key: string) => string;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
}

export default function UkraineLocationSelects<T extends FieldValues = FieldValues>({ t, control, setValue }: Props<T>) {
  const selectedRegion = useWatch({
    control,
    name: "primary_region_ukraine" as Path<T>
  }) as string | undefined;

 useEffect(() => {
  setValue("primary_city_ukraine" as Path<T>, "" as PathValue<T, Path<T>>);
}, [selectedRegion, setValue]);

  return (
    <>
      <div className="mt-6">
        <SelectWithLabel
          control={control}
          name={"primary_region_ukraine" as Path<T>}
          label={t("insuranceForm.step2.primaryRegion")}
          options={regionOptions}
          placeholder="Select a region"
        />
      </div>

      <div className="mt-6">
        <SelectWithLabel
          control={control}
          name={"primary_city_ukraine" as Path<T>}
          label={t("insuranceForm.step2.primaryCity")}
          options={getCityOptions(selectedRegion || "")}
          placeholder="Select a city"
        />
      </div>
    </>
  );
}