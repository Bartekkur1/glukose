<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190328175345 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE dose (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, amount INT NOT NULL, type VARCHAR(128) NOT NULL, date DATETIME NOT NULL, INDEX IDX_EF418CB7A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE meal (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, kcal INT NOT NULL, fats INT NOT NULL, carbohydrates INT NOT NULL, date DATETIME NOT NULL, INDEX IDX_9EF68E9CA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sugar (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, amount INT NOT NULL, date DATETIME NOT NULL, INDEX IDX_ABC4AAFFA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(191) NOT NULL, password VARCHAR(191) NOT NULL, email VARCHAR(191) NOT NULL, token VARCHAR(512) NOT NULL, UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_info (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, age INT NOT NULL, gender VARCHAR(64) NOT NULL, height INT NOT NULL, weight INT NOT NULL, insulin_type VARCHAR(128) NOT NULL, daily_insulin_type VARCHAR(128) NOT NULL, daily_insulin_amount INT NOT NULL, UNIQUE INDEX UNIQ_B1087D9EA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE dose ADD CONSTRAINT FK_EF418CB7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE meal ADD CONSTRAINT FK_9EF68E9CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE sugar ADD CONSTRAINT FK_ABC4AAFFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_info ADD CONSTRAINT FK_B1087D9EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE dose DROP FOREIGN KEY FK_EF418CB7A76ED395');
        $this->addSql('ALTER TABLE meal DROP FOREIGN KEY FK_9EF68E9CA76ED395');
        $this->addSql('ALTER TABLE sugar DROP FOREIGN KEY FK_ABC4AAFFA76ED395');
        $this->addSql('ALTER TABLE user_info DROP FOREIGN KEY FK_B1087D9EA76ED395');
        $this->addSql('DROP TABLE dose');
        $this->addSql('DROP TABLE meal');
        $this->addSql('DROP TABLE sugar');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_info');
    }
}
