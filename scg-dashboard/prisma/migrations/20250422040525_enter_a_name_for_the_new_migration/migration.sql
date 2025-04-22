BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(255) NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    [role] NVARCHAR(20) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'EMPLOYEE',
    [fullName] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [position] NVARCHAR(255),
    [department] NVARCHAR(255),
    [company] NVARCHAR(255),
    [branch] NVARCHAR(255),
    [phone] NVARCHAR(255),
    [salary] FLOAT(53),
    [employeeCode] NVARCHAR(255),
    [employeeType] NVARCHAR(255),
    [employeeGroup] NVARCHAR(255),
    [effectiveDate] DATETIME,
    [beginDate] DATETIME,
    [sso] BIT,
    [tax] BIT,
    [payrollRound] NVARCHAR(255),
    [salaryRound] NVARCHAR(255),
    [individualSetting] NVARCHAR(max),
    [createdAt] DATETIME CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [User_employeeCode_key] UNIQUE NONCLUSTERED ([employeeCode])
);

-- CreateTable
CREATE TABLE [dbo].[WorkRecord] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [date] DATETIME NOT NULL,
    [workHours] FLOAT(53),
    [overtime] FLOAT(53),
    [shiftStart] NVARCHAR(255),
    [shiftEnd] NVARCHAR(255),
    [status] NVARCHAR(20) CONSTRAINT [WorkRecord_status_df] DEFAULT 'NORMAL',
    [note] NVARCHAR(255),
    [clockIn] DATETIME,
    [clockOut] DATETIME,
    CONSTRAINT [WorkRecord_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OTRequest] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [date] DATETIME NOT NULL,
    [reason] NVARCHAR(255) NOT NULL,
    [hours] FLOAT(53) NOT NULL,
    [approved] BIT,
    [approverId] INT,
    [createdAt] DATETIME CONSTRAINT [OTRequest_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [OTRequest_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Reminder] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(255) NOT NULL,
    [details] NVARCHAR(255),
    [dueDate] DATETIME NOT NULL,
    [repeat] NVARCHAR(255),
    [isDone] BIT CONSTRAINT [Reminder_isDone_df] DEFAULT 0,
    [target] NVARCHAR(255),
    [type] NVARCHAR(20) CONSTRAINT [Reminder_type_df] DEFAULT 'CUSTOM',
    [notifyBeforeDays] INT CONSTRAINT [Reminder_notifyBeforeDays_df] DEFAULT 0,
    [notifiedMorning] BIT CONSTRAINT [Reminder_notifiedMorning_df] DEFAULT 0,
    [notifiedAfternoon] BIT CONSTRAINT [Reminder_notifiedAfternoon_df] DEFAULT 0,
    [notifiedEvening] BIT CONSTRAINT [Reminder_notifiedEvening_df] DEFAULT 0,
    [createdAt] DATETIME CONSTRAINT [Reminder_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Reminder_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PasswordStore] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [label] NVARCHAR(255) NOT NULL,
    [username] NVARCHAR(255) NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    [notes] NVARCHAR(255),
    [createdAt] DATETIME CONSTRAINT [PasswordStore_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PasswordStore_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AdminLog] (
    [id] INT NOT NULL IDENTITY(1,1),
    [adminId] INT NOT NULL,
    [action] NVARCHAR(255) NOT NULL,
    [timestamp] DATETIME CONSTRAINT [AdminLog_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    [details] NVARCHAR(255),
    CONSTRAINT [AdminLog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Explanation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATETIME NOT NULL,
    [explanation] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Explanation_status_df] DEFAULT 'PENDING',
    [employeeId] INT NOT NULL,
    [createdAt] DATETIME NOT NULL CONSTRAINT [Explanation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Explanation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[WorkRecord] ADD CONSTRAINT [WorkRecord_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OTRequest] ADD CONSTRAINT [OTRequest_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PasswordStore] ADD CONSTRAINT [PasswordStore_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AdminLog] ADD CONSTRAINT [AdminLog_adminId_fkey] FOREIGN KEY ([adminId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Explanation] ADD CONSTRAINT [Explanation_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
