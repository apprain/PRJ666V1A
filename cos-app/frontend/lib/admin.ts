export function getAdminSession() {
    return {
        tenantId: localStorage.getItem("tenant_id"),
        token: localStorage.getItem("admin_token"),
    };
}