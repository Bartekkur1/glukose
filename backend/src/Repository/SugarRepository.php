<?php

namespace App\Repository;

use App\Entity\Sugar;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
// SELECT AVG(sugar.amount), HOUR(sugar.date) FROM `sugar` GROUP BY HOUR(sugar.date)
/**
 * @method Sugar|null find($id, $lockMode = null, $lockVersion = null)
 * @method Sugar|null findOneBy(array $criteria, array $orderBy = null)
 * @method Sugar[]    findAll()
 * @method Sugar[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SugarRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Sugar::class);
    }

    public function Min($user)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->orderBy('s.amount', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function Max($user)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MinDate($user, $date)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date = :date')
            ->setParameter('date', $date)
            ->orderBy('s.amount', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MaxDate($user, $date)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date = :date')
            ->setParameter('date', $date)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MinDateRange($user, $date, $range)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.date < :range')
            ->setParameter('range', $range)
            ->orderBy('s.amount', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MaxDateRange($user, $date, $range)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.date < :range')
            ->setParameter('range', $range)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function Latest($user)
    {
        $response = $this->createQueryBuilder('s')
            ->select('MAX(s.date) as date')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
        return $response[0]["date"];
    }

    public function AvgAll($user)
    {
        return $this->createQueryBuilder('s')
            ->select('avg(s.amount) as value, id')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function AvgByDate($date, $user)
    {
        return $this->createQueryBuilder('s')
            ->select('avg(s.amount) as value')
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->orderBy('s.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AvgByRange($date, $range, $user)
    {
        return $this->createQueryBuilder('s')
            ->select('avg(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.date < :range')
            ->setParameter('range', $range)
            ->orderBy('s.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    // SELECT AVG(sugar.amount), HOUR(sugar.date) FROM `sugar` GROUP BY HOUR(sugar.date)
    public function AvgAllByHours($user)
    {
        return $this->createQueryBuilder('s')
            ->select('avg(s.amount) as value, HOUR(s.date) as hour')
            ->groupBy('hour') // <- może nie działać
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function AllByDate($date, $user)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.date > :date')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->setParameter('date', $date)
            ->orderBy('s.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AllByRange($date, $range, $user)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->andWhere('s.date < :range')
            ->orderBy('s.date', 'ASC')
            ->setParameter('date', $date)
            ->setParameter('range', $range) 
            ->getQuery()
            ->execute();
    }
}
