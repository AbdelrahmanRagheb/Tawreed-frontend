-- ============================================================
-- Tawreed Database Schema (Consolidated)
-- All constraints merged inline into CREATE TABLE statements
-- ============================================================

USE [Tawreed]
GO

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE [dbo].[group_order_items](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_goi_id] DEFAULT (newid()),
	[group_order_id] [uniqueidentifier] NOT NULL,
	[product_id] [uniqueidentifier] NOT NULL,
	[target_qty] [int] NOT NULL,
	[current_qty] [int] NOT NULL CONSTRAINT [DF_goi_current] DEFAULT ((0)),
	[locked_unit_price] [decimal](12, 2) NULL,
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_goi_created] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_goi] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_goi_order_product] UNIQUE ([group_order_id], [product_id]),
 CONSTRAINT [CK_goi_current] CHECK ([current_qty] >= 0),
 CONSTRAINT [CK_goi_target] CHECK ([target_qty] > 0),
 CONSTRAINT [FK_goi_group_order] FOREIGN KEY ([group_order_id]) REFERENCES [dbo].[group_orders] ([id]) ON DELETE CASCADE,
 CONSTRAINT [FK_goi_product] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products] ([id])
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[products](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_products_id] DEFAULT (newid()),
	[supplier_id] [uniqueidentifier] NOT NULL,
	[category_id] [uniqueidentifier] NOT NULL,
	[name_ar] [nvarchar](200) NOT NULL,
	[name_en] [nvarchar](200) NOT NULL,
	[description_ar] [nvarchar](max) NULL,
	[description_en] [nvarchar](max) NULL,
	[unit] [nvarchar](20) NOT NULL,
	[base_price] [decimal](12, 2) NOT NULL,
	[stock_qty] [int] NOT NULL CONSTRAINT [DF_products_stock] DEFAULT ((0)),
	[is_active] [bit] NOT NULL CONSTRAINT [DF_products_active] DEFAULT ((1)),
	[is_deleted] [bit] NOT NULL CONSTRAINT [DF_products_deleted] DEFAULT ((0)),
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_products_created] DEFAULT (sysutcdatetime()),
	[updated_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_products_updated] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_products] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [CK_products_price] CHECK ([base_price] >= 0),
 CONSTRAINT [CK_products_stock] CHECK ([stock_qty] >= 0),
 CONSTRAINT [FK_products_category] FOREIGN KEY ([category_id]) REFERENCES [dbo].[categories] ([id]),
 CONSTRAINT [FK_products_supplier] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers] ([user_id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[pricing_tiers](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_pricing_tiers_id] DEFAULT (newid()),
	[product_id] [uniqueidentifier] NOT NULL,
	[min_qty] [int] NOT NULL,
	[max_qty] [int] NULL,
	[unit_price] [decimal](12, 2) NOT NULL,
 CONSTRAINT [PK_pricing_tiers] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_pricing_tiers_product_min] UNIQUE ([product_id], [min_qty]),
 CONSTRAINT [CK_pricing_tiers_max] CHECK ([max_qty] IS NULL OR [max_qty] >= [min_qty]),
 CONSTRAINT [CK_pricing_tiers_min] CHECK ([min_qty] > 0),
 CONSTRAINT [CK_pricing_tiers_price] CHECK ([unit_price] >= 0),
 CONSTRAINT [FK_pricing_tiers_product] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[group_orders](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_group_orders_id] DEFAULT (newid()),
	[creator_id] [uniqueidentifier] NOT NULL,
	[region_id] [uniqueidentifier] NOT NULL,
	[title] [nvarchar](200) NOT NULL,
	[description] [nvarchar](max) NULL,
	[deadline_at] [datetimeoffset](7) NOT NULL,
	[status] [nvarchar](20) NOT NULL CONSTRAINT [DF_group_orders_status] DEFAULT (N'open'),
	[closed_at] [datetimeoffset](7) NULL,
	[total_qty] [int] NOT NULL CONSTRAINT [DF_group_orders_qty] DEFAULT ((0)),
	[current_tier_price] [decimal](12, 2) NULL,
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_group_orders_created] DEFAULT (sysutcdatetime()),
	[updated_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_group_orders_updated] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_group_orders] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [CK_group_orders_deadline] CHECK ([deadline_at] > [created_at]),
 CONSTRAINT [CK_group_orders_status] CHECK ([status] IN (N'open', N'closed', N'fulfilled', N'cancelled')),
 CONSTRAINT [FK_group_orders_creator] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[buyers] ([user_id]),
 CONSTRAINT [FK_group_orders_region] FOREIGN KEY ([region_id]) REFERENCES [dbo].[regions] ([id])
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[group_order_participants](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_gop_id] DEFAULT (newid()),
	[group_order_id] [uniqueidentifier] NOT NULL,
	[buyer_id] [uniqueidentifier] NOT NULL,
	[joined_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_gop_joined] DEFAULT (sysutcdatetime()),
	[status] [nvarchar](20) NOT NULL CONSTRAINT [DF_gop_status] DEFAULT (N'active'),
	[cancelled_at] [datetimeoffset](7) NULL,
 CONSTRAINT [PK_gop] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_gop_order_buyer] UNIQUE ([group_order_id], [buyer_id]),
 CONSTRAINT [CK_gop_status] CHECK ([status] IN (N'active', N'cancelled', N'confirmed')),
 CONSTRAINT [FK_gop_buyer] FOREIGN KEY ([buyer_id]) REFERENCES [dbo].[buyers] ([user_id]),
 CONSTRAINT [FK_gop_group_order] FOREIGN KEY ([group_order_id]) REFERENCES [dbo].[group_orders] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[regions](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_regions_id] DEFAULT (newid()),
	[name_ar] [nvarchar](100) NOT NULL,
	[name_en] [nvarchar](100) NOT NULL,
	[parent_id] [uniqueidentifier] NULL,
	[is_active] [bit] NOT NULL CONSTRAINT [DF_regions_active] DEFAULT ((1)),
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_regions_created] DEFAULT (sysutcdatetime()),
	[updated_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_regions_updated] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_regions] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [FK_regions_parent] FOREIGN KEY ([parent_id]) REFERENCES [dbo].[regions] ([id])
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[audit_logs](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_audit_id] DEFAULT (newid()),
	[actor_id] [uniqueidentifier] NOT NULL,
	[action] [nvarchar](100) NOT NULL,
	[entity_type] [nvarchar](50) NOT NULL,
	[entity_id] [uniqueidentifier] NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_audit_created] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_audit] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [FK_audit_actor] FOREIGN KEY ([actor_id]) REFERENCES [dbo].[users] ([id])
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[buyers](
	[user_id] [uniqueidentifier] NOT NULL,
	[business_name] [nvarchar](200) NOT NULL,
	[business_type] [nvarchar](20) NOT NULL,
	[tax_id] [nvarchar](50) NULL,
	[region_id] [uniqueidentifier] NOT NULL,
	[address] [nvarchar](500) NULL,
	[latitude] [decimal](9, 6) NULL,
	[longitude] [decimal](9, 6) NULL,
	[rating_avg] [decimal](3, 2) NOT NULL CONSTRAINT [DF_buyers_rating] DEFAULT ((0)),
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_buyers_created] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_buyers] PRIMARY KEY CLUSTERED ([user_id] ASC),
 CONSTRAINT [CK_buyers_business_type] CHECK ([business_type] IN (N'supermarket', N'restaurant', N'cafe', N'grocery', N'other')),
 CONSTRAINT [CK_buyers_rating] CHECK ([rating_avg] >= 0 AND [rating_avg] <= 5),
 CONSTRAINT [FK_buyers_region] FOREIGN KEY ([region_id]) REFERENCES [dbo].[regions] ([id]),
 CONSTRAINT [FK_buyers_user] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[categories](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_categories_id] DEFAULT (newid()),
	[name_ar] [nvarchar](100) NOT NULL,
	[name_en] [nvarchar](100) NOT NULL,
	[parent_id] [uniqueidentifier] NULL,
	[icon_url] [nvarchar](500) NULL,
	[sort_order] [int] NOT NULL CONSTRAINT [DF_categories_sort] DEFAULT ((0)),
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_categories_created] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_categories] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [FK_categories_parent] FOREIGN KEY ([parent_id]) REFERENCES [dbo].[categories] ([id])
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[deliveries](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_deliveries_id] DEFAULT (newid()),
	[group_order_id] [uniqueidentifier] NOT NULL,
	[invoice_id] [uniqueidentifier] NOT NULL,
	[supplier_id] [uniqueidentifier] NOT NULL,
	[delivery_person_id] [uniqueidentifier] NULL,
	[status] [nvarchar](20) NOT NULL CONSTRAINT [DF_deliveries_status] DEFAULT (N'pending'),
	[scheduled_at] [datetimeoffset](7) NULL,
	[delivered_at] [datetimeoffset](7) NULL,
	[tracking_notes] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_deliveries_created] DEFAULT (sysutcdatetime()),
	[updated_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_deliveries_updated] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_deliveries] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [CK_deliveries_status] CHECK ([status] IN (N'pending', N'confirmed', N'in_transit', N'delivered', N'cancelled')),
 CONSTRAINT [FK_deliveries_invoice] FOREIGN KEY ([invoice_id]) REFERENCES [dbo].[invoices] ([id]),
 CONSTRAINT [FK_deliveries_order] FOREIGN KEY ([group_order_id]) REFERENCES [dbo].[group_orders] ([id]),
 CONSTRAINT [FK_deliveries_person] FOREIGN KEY ([delivery_person_id]) REFERENCES [dbo].[users] ([id]),
 CONSTRAINT [FK_deliveries_supplier] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers] ([user_id])
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[invoices](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_invoices_id] DEFAULT (newid()),
	[invoice_number] [nvarchar](50) NOT NULL,
	[group_order_id] [uniqueidentifier] NOT NULL,
	[buyer_id] [uniqueidentifier] NOT NULL,
	[participant_id] [uniqueidentifier] NOT NULL,
	[subtotal] [decimal](12, 2) NOT NULL CONSTRAINT [DF_invoices_sub] DEFAULT ((0)),
	[delivery_fee] [decimal](12, 2) NOT NULL CONSTRAINT [DF_invoices_del] DEFAULT ((0)),
	[discount_amount] [decimal](12, 2) NOT NULL CONSTRAINT [DF_invoices_disc] DEFAULT ((0)),
	[total] [decimal](12, 2) NOT NULL CONSTRAINT [DF_invoices_total] DEFAULT ((0)),
	[payment_method] [nvarchar](10) NOT NULL CONSTRAINT [DF_invoices_pm] DEFAULT (N'cod'),
	[payment_status] [nvarchar](20) NOT NULL CONSTRAINT [DF_invoices_ps] DEFAULT (N'pending'),
	[issued_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_invoices_issued] DEFAULT (sysutcdatetime()),
	[paid_at] [datetimeoffset](7) NULL,
 CONSTRAINT [PK_invoices] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_invoices_number] UNIQUE ([invoice_number]),
 CONSTRAINT [UQ_invoices_part] UNIQUE ([participant_id]),
 CONSTRAINT [CK_invoices_payment_method] CHECK ([payment_method] = N'cod'),
 CONSTRAINT [CK_invoices_payment_status] CHECK ([payment_status] IN (N'pending', N'paid', N'failed', N'refunded')),
 CONSTRAINT [CK_invoices_totals] CHECK ([subtotal] >= 0 AND [total] >= 0),
 CONSTRAINT [FK_invoices_buyer] FOREIGN KEY ([buyer_id]) REFERENCES [dbo].[buyers] ([user_id]),
 CONSTRAINT [FK_invoices_order] FOREIGN KEY ([group_order_id]) REFERENCES [dbo].[group_orders] ([id]),
 CONSTRAINT [FK_invoices_participant] FOREIGN KEY ([participant_id]) REFERENCES [dbo].[group_order_participants] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[notifications](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_notifications_id] DEFAULT (newid()),
	[user_id] [uniqueidentifier] NOT NULL,
	[type] [nvarchar](30) NOT NULL,
	[title_ar] [nvarchar](200) NOT NULL,
	[title_en] [nvarchar](200) NOT NULL,
	[body_ar] [nvarchar](max) NULL,
	[body_en] [nvarchar](max) NULL,
	[channel] [nvarchar](20) NOT NULL CONSTRAINT [DF_notifications_channel] DEFAULT (N'in_app'),
	[is_read] [bit] NOT NULL CONSTRAINT [DF_notifications_read] DEFAULT ((0)),
	[read_at] [datetimeoffset](7) NULL,
	[related_order_id] [uniqueidentifier] NULL,
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_notifications_created] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_notifications] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [CK_notifications_channel] CHECK ([channel] IN (N'in_app', N'email', N'push')),
 CONSTRAINT [CK_notifications_type] CHECK ([type] IN (N'new_participation', N'deadline_approaching', N'order_closed', N'delivery_update', N'price_change', N'system')),
 CONSTRAINT [FK_notifications_order] FOREIGN KEY ([related_order_id]) REFERENCES [dbo].[group_orders] ([id]),
 CONSTRAINT [FK_notifications_user] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[participant_items](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_pi_id] DEFAULT (newid()),
	[participant_id] [uniqueidentifier] NOT NULL,
	[group_order_item_id] [uniqueidentifier] NOT NULL,
	[quantity] [int] NOT NULL,
	[unit_price_at_join] [decimal](12, 2) NOT NULL,
	[final_unit_price] [decimal](12, 2) NULL,
	[line_total] [decimal](12, 2) NULL,
 CONSTRAINT [PK_pi] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_pi_part_goi] UNIQUE ([participant_id], [group_order_item_id]),
 CONSTRAINT [CK_pi_qty] CHECK ([quantity] > 0),
 CONSTRAINT [FK_pi_goi] FOREIGN KEY ([group_order_item_id]) REFERENCES [dbo].[group_order_items] ([id]),
 CONSTRAINT [FK_pi_participant] FOREIGN KEY ([participant_id]) REFERENCES [dbo].[group_order_participants] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[product_images](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_product_images_id] DEFAULT (newid()),
	[product_id] [uniqueidentifier] NOT NULL,
	[image_url] [nvarchar](500) NOT NULL,
	[sort_order] [int] NOT NULL CONSTRAINT [DF_product_images_sort] DEFAULT ((0)),
	[is_cover] [bit] NOT NULL CONSTRAINT [DF_product_images_cover] DEFAULT ((0)),
 CONSTRAINT [PK_product_images] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [FK_product_images_product] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[suppliers](
	[user_id] [uniqueidentifier] NOT NULL,
	[company_name] [nvarchar](200) NOT NULL,
	[tax_id] [nvarchar](50) NULL,
	[region_id] [uniqueidentifier] NOT NULL,
	[is_approved] [bit] NOT NULL CONSTRAINT [DF_suppliers_approved] DEFAULT ((0)),
	[approved_by] [uniqueidentifier] NULL,
	[approved_at] [datetimeoffset](7) NULL,
	[rating_avg] [decimal](3, 2) NOT NULL CONSTRAINT [DF_suppliers_rating] DEFAULT ((0)),
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_suppliers_created] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_suppliers] PRIMARY KEY CLUSTERED ([user_id] ASC),
 CONSTRAINT [CK_suppliers_rating] CHECK ([rating_avg] >= 0 AND [rating_avg] <= 5),
 CONSTRAINT [FK_suppliers_approver] FOREIGN KEY ([approved_by]) REFERENCES [dbo].[users] ([id]),
 CONSTRAINT [FK_suppliers_region] FOREIGN KEY ([region_id]) REFERENCES [dbo].[regions] ([id]),
 CONSTRAINT [FK_suppliers_user] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[users](
	[id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_users_id] DEFAULT (newid()),
	[email] [nvarchar](255) NOT NULL,
	[password_hash] [nvarchar](255) NOT NULL,
	[phone] [nvarchar](20) NOT NULL,
	[full_name] [nvarchar](150) NOT NULL,
	[role] [nvarchar](20) NOT NULL,
	[status] [nvarchar](20) NOT NULL CONSTRAINT [DF_users_status] DEFAULT ('pending'),
	[preferred_lang] [nchar](2) NOT NULL CONSTRAINT [DF_users_lang] DEFAULT (N'ar'),
	[email_verified] [bit] NOT NULL CONSTRAINT [DF_users_email_v] DEFAULT ((0)),
	[phone_verified] [bit] NOT NULL CONSTRAINT [DF_users_phone_v] DEFAULT ((0)),
	[last_login_at] [datetimeoffset](7) NULL,
	[is_deleted] [bit] NOT NULL CONSTRAINT [DF_users_deleted] DEFAULT ((0)),
	[created_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_users_created] DEFAULT (sysutcdatetime()),
	[updated_at] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_users_updated] DEFAULT (sysutcdatetime()),
 CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_users_email] UNIQUE ([email]),
 CONSTRAINT [UQ_users_phone] UNIQUE ([phone]),
 CONSTRAINT [CK_users_lang] CHECK ([preferred_lang] IN (N'ar', N'en')),
 CONSTRAINT [CK_users_role] CHECK ([role] IN (N'buyer', N'supplier', N'admin')),
 CONSTRAINT [CK_users_status] CHECK ([status] IN (N'active', N'pending', N'suspended'))
) ON [PRIMARY]
GO

-- ============================================================
-- VIEWS
-- ============================================================

CREATE VIEW [dbo].[vw_current_pricing]
AS
SELECT
    goi.id                                  AS group_order_item_id,
    goi.group_order_id,
    goi.product_id,
    goi.current_qty,
    p.unit                                  AS product_unit,
    pt.min_qty,
    pt.max_qty,
    pt.unit_price                           AS tier_price,
    ISNULL(pt.unit_price, p.base_price)     AS effective_price
FROM dbo.group_order_items goi
INNER JOIN dbo.products p          ON p.id = goi.product_id
LEFT  JOIN dbo.pricing_tiers pt
       ON pt.product_id = goi.product_id
      AND goi.current_qty >= pt.min_qty
      AND (pt.max_qty IS NULL OR goi.current_qty < pt.max_qty);
GO

CREATE VIEW [dbo].[vw_group_order_feed]
AS
SELECT
    o.id                                          AS order_id,
    o.title,
    o.region_id,
    r.name_ar                                     AS region_name_ar,
    r.name_en                                     AS region_name_en,
    o.deadline_at,
    o.status,
    o.total_qty,
    o.current_tier_price,
    DATEDIFF(HOUR, SYSUTCDATETIME(), o.deadline_at) AS hours_remaining,
    (SELECT COUNT(*) FROM dbo.group_order_participants p
        WHERE p.group_order_id = o.id AND p.status = N'active') AS participants_count
FROM dbo.group_orders o
INNER JOIN dbo.regions r ON r.id = o.region_id
WHERE o.status = N'open'
  AND o.deadline_at > SYSUTCDATETIME();
GO

-- ============================================================
-- INDEXES
-- ============================================================

CREATE NONCLUSTERED INDEX [IX_audit_actor] ON [dbo].[audit_logs] ([actor_id])
GO
CREATE NONCLUSTERED INDEX [IX_audit_created] ON [dbo].[audit_logs] ([created_at] DESC)
GO
CREATE NONCLUSTERED INDEX [IX_audit_entity] ON [dbo].[audit_logs] ([entity_type], [entity_id])
GO
CREATE NONCLUSTERED INDEX [IX_buyers_region] ON [dbo].[buyers] ([region_id])
GO
CREATE NONCLUSTERED INDEX [IX_buyers_type] ON [dbo].[buyers] ([business_type])
GO
CREATE NONCLUSTERED INDEX [IX_categories_parent] ON [dbo].[categories] ([parent_id])
GO
CREATE NONCLUSTERED INDEX [IX_deliveries_invoice] ON [dbo].[deliveries] ([invoice_id])
GO
CREATE NONCLUSTERED INDEX [IX_deliveries_order] ON [dbo].[deliveries] ([group_order_id])
GO
CREATE NONCLUSTERED INDEX [IX_deliveries_status] ON [dbo].[deliveries] ([status])
GO
CREATE NONCLUSTERED INDEX [IX_deliveries_supplier] ON [dbo].[deliveries] ([supplier_id])
GO
CREATE NONCLUSTERED INDEX [IX_goi_order] ON [dbo].[group_order_items] ([group_order_id])
GO
CREATE NONCLUSTERED INDEX [IX_goi_product] ON [dbo].[group_order_items] ([product_id])
GO
CREATE NONCLUSTERED INDEX [IX_gop_buyer] ON [dbo].[group_order_participants] ([buyer_id])
GO
CREATE NONCLUSTERED INDEX [IX_gop_status] ON [dbo].[group_order_participants] ([status])
GO
CREATE NONCLUSTERED INDEX [IX_group_orders_creator] ON [dbo].[group_orders] ([creator_id])
GO
CREATE NONCLUSTERED INDEX [IX_group_orders_region] ON [dbo].[group_orders] ([region_id])
GO
CREATE NONCLUSTERED INDEX [IX_group_orders_status_dl] ON [dbo].[group_orders] ([status], [deadline_at])
GO
CREATE NONCLUSTERED INDEX [IX_invoices_buyer] ON [dbo].[invoices] ([buyer_id])
GO
CREATE NONCLUSTERED INDEX [IX_invoices_order] ON [dbo].[invoices] ([group_order_id])
GO
CREATE NONCLUSTERED INDEX [IX_invoices_status] ON [dbo].[invoices] ([payment_status])
GO
CREATE NONCLUSTERED INDEX [IX_notifications_order] ON [dbo].[notifications] ([related_order_id])
GO
CREATE NONCLUSTERED INDEX [IX_notifications_user_unread] ON [dbo].[notifications] ([user_id], [is_read], [created_at] DESC)
GO
CREATE NONCLUSTERED INDEX [IX_pi_goi] ON [dbo].[participant_items] ([group_order_item_id])
GO
CREATE NONCLUSTERED INDEX [IX_pi_participant] ON [dbo].[participant_items] ([participant_id])
GO
CREATE NONCLUSTERED INDEX [IX_pricing_tiers_product] ON [dbo].[pricing_tiers] ([product_id], [min_qty])
GO
CREATE NONCLUSTERED INDEX [IX_product_images_product] ON [dbo].[product_images] ([product_id])
GO
CREATE NONCLUSTERED INDEX [IX_products_category] ON [dbo].[products] ([category_id])
GO
CREATE NONCLUSTERED INDEX [IX_products_deleted] ON [dbo].[products] ([is_deleted])
GO
CREATE NONCLUSTERED INDEX [IX_products_supplier_active] ON [dbo].[products] ([supplier_id], [is_active])
GO
CREATE NONCLUSTERED INDEX [IX_regions_active] ON [dbo].[regions] ([is_active])
GO
CREATE NONCLUSTERED INDEX [IX_regions_parent] ON [dbo].[regions] ([parent_id])
GO
CREATE NONCLUSTERED INDEX [IX_suppliers_approved] ON [dbo].[suppliers] ([is_approved])
GO
CREATE NONCLUSTERED INDEX [IX_suppliers_region] ON [dbo].[suppliers] ([region_id])
GO
CREATE NONCLUSTERED INDEX [IX_users_deleted] ON [dbo].[users] ([is_deleted])
GO
CREATE NONCLUSTERED INDEX [IX_users_role] ON [dbo].[users] ([role])
GO
CREATE NONCLUSTERED INDEX [IX_users_status] ON [dbo].[users] ([status])
GO

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT [dbo].[categories] ([id], [name_ar], [name_en], [parent_id], [icon_url], [sort_order], [created_at]) VALUES (N'56cac1a4-0f1a-4f23-b6a8-439acb195b69', N'لحوم ودواجن', N'Meat & Poultry', NULL, NULL, 0, CAST(N'2026-06-07T15:20:12.1187061+00:00' AS DateTimeOffset))
INSERT [dbo].[categories] ([id], [name_ar], [name_en], [parent_id], [icon_url], [sort_order], [created_at]) VALUES (N'7990ecbf-4d05-47e2-8bc4-98756b6a2791', N'خضروات وفاكهة', N'Fruits & Vegetables', NULL, NULL, 0, CAST(N'2026-06-07T15:20:12.1187061+00:00' AS DateTimeOffset))
INSERT [dbo].[categories] ([id], [name_ar], [name_en], [parent_id], [icon_url], [sort_order], [created_at]) VALUES (N'9896e596-98ae-405d-85f0-b1de857c3bc3', N'ألبان', N'Dairy', NULL, NULL, 0, CAST(N'2026-06-07T15:20:12.1187061+00:00' AS DateTimeOffset))
INSERT [dbo].[categories] ([id], [name_ar], [name_en], [parent_id], [icon_url], [sort_order], [created_at]) VALUES (N'005f1e05-e6da-4fe9-b7f3-b527eefa840c', N'مواد غذائية', N'Food & Beverages', NULL, NULL, 0, CAST(N'2026-06-07T15:20:12.1187061+00:00' AS DateTimeOffset))
INSERT [dbo].[categories] ([id], [name_ar], [name_en], [parent_id], [icon_url], [sort_order], [created_at]) VALUES (N'18de35e0-8ca0-4011-98bf-e1bb155b0812', N'منظفات', N'Cleaning Supplies', NULL, NULL, 0, CAST(N'2026-06-07T15:20:12.1187061+00:00' AS DateTimeOffset))
GO

INSERT [dbo].[regions] ([id], [name_ar], [name_en], [parent_id], [is_active], [created_at], [updated_at]) VALUES (N'd2f6ad27-49fd-4d63-8ba8-241a32992427', N'المنصورة', N'Mansoura', NULL, 1, CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset), CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset))
INSERT [dbo].[regions] ([id], [name_ar], [name_en], [parent_id], [is_active], [created_at], [updated_at]) VALUES (N'1001090d-24aa-4cb1-aaa8-94d5594faad0', N'الجيزة', N'Giza', NULL, 1, CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset), CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset))
INSERT [dbo].[regions] ([id], [name_ar], [name_en], [parent_id], [is_active], [created_at], [updated_at]) VALUES (N'7d07d25c-5dc5-4366-8507-99fbeb9361b5', N'أسيوط', N'Assiut', NULL, 1, CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset), CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset))
INSERT [dbo].[regions] ([id], [name_ar], [name_en], [parent_id], [is_active], [created_at], [updated_at]) VALUES (N'fa20d734-1c38-4584-990c-cb3325dea903', N'القاهرة', N'Cairo', NULL, 1, CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset), CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset))
INSERT [dbo].[regions] ([id], [name_ar], [name_en], [parent_id], [is_active], [created_at], [updated_at]) VALUES (N'bb779b87-173c-4ae8-a967-d6bdeefe34c9', N'الإسكندرية', N'Alexandria', NULL, 1, CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset), CAST(N'2026-06-07T15:20:12.1151470+00:00' AS DateTimeOffset))
GO

INSERT [dbo].[users] ([id], [email], [password_hash], [phone], [full_name], [role], [status], [preferred_lang], [email_verified], [phone_verified], [last_login_at], [is_deleted], [created_at], [updated_at]) VALUES (N'7489e576-e536-43f4-94f5-787e8be5318d', N'admin@platform.eg', N'$2a$11$REPLACE_WITH_BCRYPT_HASH', N'+201000000001', N'System Admin', N'admin', N'active', N'ar', 1, 0, NULL, 0, CAST(N'2026-06-07T15:20:12.1235148+00:00' AS DateTimeOffset), CAST(N'2026-06-07T15:20:12.1235148+00:00' AS DateTimeOffset))
GO
