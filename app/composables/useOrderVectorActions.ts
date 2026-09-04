import { computed, unref, type Ref } from "vue";
import { OrderStatus } from "~~/shared/types/enums";

type EntityType = "order" | "vector";

export const useOrderVectorActions = (type: Ref<EntityType> | EntityType) => {
  const toast = useToast();

  const apiBase = computed(() =>
    unref(type) === "vector" ? "/api/vectors" : "/api/orders",
  );

  const updateStatus = async (
    id: string | number,
    action: "approve" | "reject" | "cancel",
  ) => {
    const statusMap: Record<string, OrderStatus> = {
      approve: OrderStatus.IN_PROGRESS,
      reject: OrderStatus.REJECTED,
      cancel: OrderStatus.CANCELLED,
    };
    const entityType = unref(type);
    const apiIdKey = entityType === "vector" ? "vectorId" : "orderId";
    try {
      await $fetch(`${apiBase.value}/status`, {
        method: "POST",
        body: { [apiIdKey]: id, status: statusMap[action] },
      });
      toast.success(
        `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} status updated successfully`,
      );
      return true;
    } catch (e) {
      console.error(e);
      toast.error(`Failed to update ${entityType} status`);
      return false;
    }
  };

  const deliver = async (id: string | number, formData: any) => {
    const entityType = unref(type);
    try {
      const fd = new FormData();
      fd.append(entityType === "vector" ? "vectorId" : "orderId", String(id));
      fd.append("stitches", formData.stitches);
      fd.append("price", formData.price);
      if (formData.discount) fd.append("discount", formData.discount);
      if (formData.total_price)
        fd.append("total_price", formData.total_price);
      if (formData.order_category)
        fd.append("order_category", formData.order_category);
      if (formData.height) fd.append("height", formData.height);
      if (formData.width) fd.append("width", formData.width);
      if (formData.comments) fd.append("comments", formData.comments);
      if (formData.designer_level)
        fd.append("designer_level", formData.designer_level);
      if (formData.assign_percentage)
        fd.append("assign_percentage", formData.assign_percentage);
      if (formData.minimum_price)
        fd.append("minimum_price", formData.minimum_price);
      if (formData.maximum_price)
        fd.append("maximum_price", formData.maximum_price);
      if (formData.thousand_stitches)
        fd.append("thousand_stitches", formData.thousand_stitches);
      if (formData.normal_delivery)
        fd.append("normal_delivery", formData.normal_delivery);
      if (formData.edit_or_change)
        fd.append("edit_or_change", formData.edit_or_change);
      if (formData.edit_in_stitch_file)
        fd.append("edit_in_stitch_file", formData.edit_in_stitch_file);
      (formData.attachments || []).forEach((f: File) =>
        fd.append("attachments", f),
      );

      const endpoint =
        entityType === "vector" ? "/api/vectors/deliver" : "/api/orders/deliver";
      await $fetch(endpoint, { method: "POST", body: fd });

      toast.success(
        `${entityType === "vector" ? "Vector" : "Order"} delivered successfully`,
      );
      return true;
    } catch (e) {
      console.error(e);
      toast.error(`Failed to deliver ${entityType}`);
      return false;
    }
  };

  return { updateStatus, deliver };
};
