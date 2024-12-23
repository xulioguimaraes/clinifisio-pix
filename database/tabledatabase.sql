CREATE TABLE `users_time_intervals` (
	`id` varchar(191) NOT NULL,
	`week_day` int NOT NULL,
	`time_start_in_minutes` int NOT NULL,
	`time_end_in_minutes` int NOT NULL,
	`user_id` varchar(191) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `users_time_intervals_user_id_idx` (`user_id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

  CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`bio` text,
	`email` varchar(191),
	`create_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`avatar_url` varchar(191),
	PRIMARY KEY (`id`),
	UNIQUE KEY `users_username_key` (`username`),
	UNIQUE KEY `users_email_key` (`email`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;


  CREATE TABLE `sessions` (
	`id` varchar(191) NOT NULL,
	`session_token` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `sessions_session_token_key` (`session_token`),
	KEY `sessions_user_id_idx` (`user_id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `schedulings` (
	`id` varchar(191) NOT NULL,
	`date` datetime(3) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`observations` varchar(191),
	`created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`user_id` varchar(191) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `schedulings_user_id_idx` (`user_id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;


  CREATE TABLE `accounts` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`provider_account_id` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	PRIMARY KEY (`id`),
	UNIQUE KEY `accounts_provider_provider_account_id_key` (`provider`, `provider_account_id`),
	KEY `accounts_user_id_idx` (`user_id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;